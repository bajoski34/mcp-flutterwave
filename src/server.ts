import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import tools from "./registered-tools.js";

// Create server instance.
const server = new McpServer({
    name: "flutterwave",
    version: "0.1.0",
}, {
    capabilities: {
        tools: {},
    },
});

for (const tool of tools) {
    server.tool(tool.name, tool.description, tool.inputSchema, tool.cb)
}

export default server;
