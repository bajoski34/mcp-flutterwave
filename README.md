# mcp-flutterwave
An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that enables AI assistants to interact with Flutterwave, providing tools for confirming transactions, send failed hooks, and more.

## Warning!!!
This MCP is in active development.

## Features

- Confirm Transactions (Already included)
- Retry Failed Transactions (Automatically retry transactions with recoverable errors) [x]
- Retrieve Transaction History (Fetch and analyze past transactions) [x]
- Send Failed Hooks (Already included)
- Generate Payment Links [x]
- Automated Customer Support (AI chatbot integrated with Flutterwave for transaction inquiries) [x]

## Usage with Claude Desktop
Add the following to your `claude_desktop_config.json`. See [here](https://modelcontextprotocol.io/quickstart/user) for more details.

```json
{
  "mcpServers": {
    "flutterwave": {
      "command": "node",
      "args": [
	        "/Users/username/Documents/mcp-flutterwave/build/index.js",
          "--tools=create_checkout,disable_checkout,read_transactions, read_transaction, resend_transaction_webhook"
      ],
      "env": {
        "FLW_SECRET_KEY": "YOUR_SECRET_KEY"
      }
    }
  }
}
```

### Local Setup Steps

1. Clone the repository.
2. Install the depencies
3. Setup the Claude Configuration
4. Open Claude and Ask question related to Flutterwave

## Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on how to get started, development guidelines, and how to submit changes.

