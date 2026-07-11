#!/usr/bin/env node
/**
 * Remote MCP entrypoint — Streamable HTTP transport.
 *
 * Runs the Flutterwave MCP server behind Express so it can be deployed
 * to Fly.io (or any host). Stateless mode: a fresh McpServer + transport
 * is created per request, per the MCP SDK's recommended pattern.
 *
 * Required environment variables:
 *   FLW_SECRET_KEY  - Flutterwave secret key (validated in src/config).
 *   MCP_AUTH_TOKEN  - Bearer token clients must present. The server
 *                     refuses to start without it (fail closed): this
 *                     endpoint can move money.
 * Optional:
 *   PORT            - Listen port (default 8080, matches fly.toml).
 */
import { createHash, timingSafeEqual, randomBytes } from "node:crypto";
import express, { type Request, type Response, type NextFunction } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "./server.js";
// Importing config validates FLW_SECRET_KEY at boot and crashes early if missing.
import { config } from "./config/index.js";

const PORT = parseInt(process.env.PORT ?? "8080", 10);
const AUTH_TOKEN = process.env.MCP_AUTH_TOKEN;

if (!AUTH_TOKEN || AUTH_TOKEN.length < 16) {
    console.error(
        "MCP_AUTH_TOKEN is missing or too short (min 16 chars). " +
        "Refusing to start an unauthenticated payments MCP server.\n" +
        `Generate one with: openssl rand -hex 32 (example: ${randomBytes(32).toString("hex")})`
    );
    process.exit(1);
}

// Hash both sides so timingSafeEqual gets equal-length buffers.
const expectedDigest = createHash("sha256").update(AUTH_TOKEN).digest();

function isAuthorized(req: Request): boolean {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return false;
    const presented = createHash("sha256").update(header.slice(7)).digest();
    return timingSafeEqual(presented, expectedDigest);
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (isAuthorized(req)) return next();
    res.status(401).json({
        jsonrpc: "2.0",
        error: { code: -32001, message: "Unauthorized: missing or invalid bearer token" },
        id: null,
    });
}

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));

// Unauthenticated health check for Fly.
app.get("/health", (_req, res) => {
    res.json({ status: "ok", env: config.server.environment });
});

// Stateless Streamable HTTP: new server + transport per POST.
app.post("/mcp", requireAuth, async (req: Request, res: Response) => {
    try {
        const server = createServer();
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
        });
        res.on("close", () => {
            transport.close();
            server.close();
        });
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error("Error handling MCP request:", error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: "2.0",
                error: { code: -32603, message: "Internal server error" },
                id: null,
            });
        }
    }
});

// Stateless mode has no server-initiated streams or sessions to manage.
const methodNotAllowed = (_req: Request, res: Response) => {
    res.status(405).json({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Method not allowed in stateless mode" },
        id: null,
    });
};
app.get("/mcp", requireAuth, methodNotAllowed);
app.delete("/mcp", requireAuth, methodNotAllowed);

const httpServer = app.listen(PORT, "0.0.0.0", () => {
    console.error(`Flutterwave MCP Server (Streamable HTTP) listening on 0.0.0.0:${PORT}`);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => {
        console.error(`${signal} received, shutting down...`);
        httpServer.close(() => process.exit(0));
        setTimeout(() => process.exit(0), 5000).unref();
    });
}