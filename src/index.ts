#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import server from "./server.js";
import { Options } from "./types/index.js";
import { config } from "./config/index.js";

const ACCEPTED_ARGS = ['tools'];

const ACCEPTED_TOOLS = [
    'create_checkout',
    'disable_checkout',
    'create_refund',
    'read_transactions',
    'read_transaction',
    'read_transaction_timeline',
    'resend_transaction_webhook',
    'create_plan',
    'read_plan',
    'read_subscription'
];

export function parseArgs(args: string[]): Options {
    const options: Options = {};

    args.forEach((arg) => {
        if (arg.startsWith('--')) {
            const [key, value] = arg.slice(2).split('=');

            if (key == 'tools') {
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

    // Validate tools against accepted enum values.
    options.tools.forEach((tool: string) => {
        if (tool == 'all') {
            return;
        }
        if (!ACCEPTED_TOOLS.includes(tool.trim())) {
            throw new Error(
                `Invalid tool: ${tool}. Accepted tools are: ${ACCEPTED_TOOLS.join(
                    ', '
                )}`
            );
        }
    });

    // Check if API key is either provided in args or set in environment variables
    const apiKey = process.env.FLW_SECRET_KEY;

    if (!apiKey) {
        throw new Error(
            'Flutterwave Secret key not provided. Please either pass it as an argument --secret-key=$KEY or set the FLW_SECRET_KEY environment variable.'
        );
    }

    options.apiKey = apiKey;

    return options;
}

async function main() {
    const options = parseArgs(process.argv.slice(2));
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

