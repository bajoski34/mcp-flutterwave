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
    "stripe": {
      "command": "npx",
      "args": [
          "-y",
          "mcp-flutterwave",
          "--tools=checkout.create",
          "--secret-key=FLW_SECRET_KEY"
      ]
    }
  }
}
```