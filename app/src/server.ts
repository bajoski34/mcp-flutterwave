import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import Anthropic from "@anthropic-ai/sdk";
import { MCPClient } from "./mcp-client.js";
import { chat, type ConversationMessage } from "./conversation.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function createServer() {
    const app = express();
    app.use(express.json());
    app.use(express.static(join(__dirname, "public")));

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const flwKey = process.env.FLW_SECRET_KEY;

    if (!apiKey) throw new Error("ANTHROPIC_API_KEY environment variable is required");
    if (!flwKey) throw new Error("FLW_SECRET_KEY environment variable is required");

    const anthropic = new Anthropic({ apiKey });
    const mcpClient = new MCPClient(flwKey);
    let mcpReady = false;

    const ensureMcp = async () => {
        if (!mcpReady) {
            await mcpClient.connect();
            mcpReady = true;
        }
    };

    app.get("/api/tools", async (_req, res) => {
        try {
            await ensureMcp();
            const tools = await mcpClient.listTools();
            res.json({ tools: tools.map((t) => ({ name: t.name, description: t.description })) });
        } catch (err) {
            res.status(500).json({ error: "Failed to list tools" });
        }
    });

    app.post("/api/chat", async (req, res) => {
        try {
            await ensureMcp();
            const { message, history = [] }: {
                message: string;
                history: ConversationMessage[];
            } = req.body;

            if (!message?.trim()) {
                res.status(400).json({ error: "message is required" });
                return;
            }

            const result = await chat(anthropic, mcpClient, history, message.trim());
            res.json(result);
        } catch (err) {
            console.error("[chat]", err);
            res.status(500).json({ error: "An error occurred" });
        }
    });

    process.on("SIGTERM", async () => {
        await mcpClient.close();
        process.exit(0);
    });

    return app;
}
