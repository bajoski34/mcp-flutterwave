import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Resolves to the built MCP server entry point
const SERVER_PATH = join(__dirname, "../../build/index.js");

export class MCPClient {
    private client: Client;
    private transport: StdioClientTransport;
    private connected = false;

    constructor(secretKey: string) {
        this.transport = new StdioClientTransport({
            command: "node",
            args: [SERVER_PATH, "--tools=all"],
            env: {
                ...process.env as Record<string, string>,
                FLW_SECRET_KEY: secretKey,
            },
            stderr: "inherit",
        });

        this.client = new Client({ name: "mcp-flutterwave-app", version: "1.0.0" });
    }

    async connect() {
        if (this.connected) return;
        await this.client.connect(this.transport);
        this.connected = true;
        console.log("[mcp] connected to flutterwave server");
    }

    async listTools() {
        const { tools } = await this.client.listTools();
        return tools;
    }

    async callTool(name: string, args: Record<string, unknown>) {
        return this.client.callTool({ name, arguments: args });
    }

    async close() {
        if (!this.connected) return;
        await this.client.close();
        this.connected = false;
    }
}
