import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTools } from "./tools/index.js";
import { registerPrompts } from "./prompts/index.js";

/**
 * Live-bound server instance.
 *
 * Tool/prompt modules import { server } from this file and call
 * server.tool(...) inside their register functions. Because ESM exports
 * are live bindings, reassigning `server` here means those register
 * functions operate on whichever instance is current when they run.
 *
 * - stdio (index.ts): uses the initial instance below, registered once.
 * - HTTP (http.ts): calls createServer() per request for stateless
 *   Streamable HTTP, since one McpServer can only hold one transport.
 */
export let server = new McpServer({
    name: "flutterwave",
    version: "1.4.1",
});

/**
 * Create a fresh McpServer with all tools and prompts registered.
 * Fully synchronous, so concurrent HTTP requests cannot interleave
 * with registration on Node's single-threaded event loop.
 */
export function createServer(): McpServer {
    server = new McpServer({
        name: "flutterwave",
        version: "1.4.1",
    });
    registerTools();
    registerPrompts();
    return server;
}

// Register tools and prompts on the initial (stdio) instance.
registerTools();
registerPrompts();

export default server;