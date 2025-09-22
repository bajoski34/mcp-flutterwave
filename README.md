# mcp-flutterwave
An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that enables AI assistants to interact with Flutterwave, providing tools for confirming transactions, send failed hooks, and more.

## Warning!!!
This MCP is in active development.

## Features

- Confirm Transactions (Already included)
- Retry Failed Transactions (Automatically retry transactions with recoverable errors) [✓]
- Retrieve Transaction History (Fetch and analyze past transactions) [✓]
- Send Failed Hooks (Already included)
- Generate Payment Links [✓]
- Automated Customer Support (AI chatbot integrated with Flutterwave for transaction inquiries) [✓]

## Available Tools

- `get-transactions`: Get the final status of a transaction with a transaction ID
- `resent-failed-webhook`: Resend failed webhook for a transaction
- `create-checkout`: Create a payment link for customers
- `disable-checkout`: Disable a checkout transaction link
- `retry-transaction`: Analyze and provide guidance for retrying a failed transaction
- `get-transaction-timeline`: Get the timeline/history of events for a transaction

## Installation

### Via npm (Recommended)
```bash
npm install -g mcp-flutterwave
```

### Via GitHub
```bash
git clone https://github.com/bajoski34/mcp-flutterwave.git
cd mcp-flutterwave
npm install
npm run build
```

## Usage with Claude Desktop
Add the following to your `claude_desktop_config.json`. See [here](https://modelcontextprotocol.io/quickstart/user) for more details.

### Using npm installation
```json
{
  "mcpServers": {
    "flutterwave": {
      "command": "mcp-flutterwave",
      "args": [
        "--tools=create_checkout,disable_checkout,read_transaction,resend_transaction_webhook"
      ],
      "env": {
        "FLW_SECRET_KEY": "YOUR_SECRET_KEY"
      }
    }
  }
}
```

### Using local build
```json
{
  "mcpServers": {
    "flutterwave": {
      "command": "node",
      "args": [
        "/path/to/mcp-flutterwave/build/index.js",
        "--tools=create_checkout,disable_checkout,read_transaction,resend_transaction_webhook"
      ],
      "env": {
        "FLW_SECRET_KEY": "YOUR_SECRET_KEY"
      }
    }
  }
}
```

## Setup Steps

1. **Install the package**
   ```bash
   npm install -g mcp-flutterwave
   ```

2. **Get your Flutterwave secret key**
   - Log into your Flutterwave dashboard
   - Go to Settings > API Keys
   - Copy your Secret Key

3. **Configure Claude Desktop**
   - Add the configuration to your `claude_desktop_config.json`
   - Replace `YOUR_SECRET_KEY` with your actual Flutterwave secret key

4. **Start using with Claude**
   - Open Claude Desktop
   - Ask questions related to Flutterwave transactions, payments, etc.

## Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on how to get started, development guidelines, and how to submit changes.

