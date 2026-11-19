#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import server, { startServer } from "./server.js";
import { Options } from "./types/index.js";
import "./config/index.js";
import { getApiVersion } from "./config/apiVersion.js";
import { acceptedToolsFor } from "./config/acceptedTools.js";

const ACCEPTED_ARGS = ['tools'];

export function parseArgs(args: string[]): Options {
    const options: Options = {};

    args.forEach((arg) => {
        if (arg.startsWith('--')) {
            const [key, value] = arg.slice(2).split('=');

            if (key === 'tools') {
                options.tools = value.split(',');
            } else {
                throw new Error(
                    `Invalid argument: ${key}. Accepted arguments are: ${ACCEPTED_ARGS.join(
                        ', '
                    )}`
                );
            }
        }
    });

    // Check if required tools arguments is present.
    if (!options.tools) {
        throw new Error('The --tools arguments must be provided.');
    }

    const apiVersion = getApiVersion();
    const acceptedTools = acceptedToolsFor(apiVersion);
    const acceptedToolsSet = new Set<string>(acceptedTools);

    // Validate tools against the version that this process is registered for.
    options.tools.forEach((tool: string) => {
        const trimmedTool = tool.trim();
        if (trimmedTool === 'all') {
            return;
        }
        if (!acceptedToolsSet.has(trimmedTool)) {
            throw new Error(
                `Invalid tool: ${tool}. Accepted tools are: ${acceptedTools.join(
                    ', '
                )}`
            );
        }
    });

    if (apiVersion === 'v3') {
        const apiKey = process.env.FLW_SECRET_KEY;

        if (!apiKey) {
            throw new Error(
                'Flutterwave Secret key not provided. Set the FLW_SECRET_KEY environment variable.'
            );
        }

        options.apiKey = apiKey;
    }

    return options;
}

async function main() {
    const options = parseArgs(process.argv.slice(2));
    await startServer();
    const transport = new StdioServerTransport();

    // Handle process termination
    process.on('SIGINT', async () => {
      console.error('Shutting down Flutterwave MCP Server...');
      await server.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.error('Shutting down Flutterwave MCP Server...');
      await server.close();
      process.exit(0);
    });

    await server.connect(transport);
    console.error("Flutterwave MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});

