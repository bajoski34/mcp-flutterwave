import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { server } from "../server.js";

const tools:any[] = [];

/**
 * Register tool for the Flutterwave MCP Server to function
 */

// tools.push({
//     name: "sample",
//     description: "Sample Tool",
//     inputSchema: { sample: z.string().min(1, "Sample is required").describe("Sample") },
//     cb: ((args: any) => {
//         return {
//             content: [{ type: "text", text: `Sample Tool Executed with args: ${JSON.stringify(args)}` }] };
//     }),
// });

export async function registerRequiredTools() {

    // Register required tools with the server.
    for (const tool of tools) {
        server.tool(tool.name, tool.description, tool.inputSchema, tool.cb);
    }

}
