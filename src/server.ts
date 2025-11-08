import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTools } from "./tools/index.js";
import { registerPrompts } from "./prompts/index.js";

// Create server instance.
export const server = new McpServer({
    name: "flutterwave",
    version: "1.3.2",
});

// Register tools with the server.
registerTools();
registerPrompts();

export default server;
