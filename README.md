# mcp-flutterwave
An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that enables AI assistants to interact with Flutterwave, providing tools for confirming transactions, send failed hooks, and more.

## ✨ MCP-UI Support

This server now includes beautiful, interactive UI components powered by [MCP-UI](https://github.com/idosal/mcp-ui)! Get rich, branded visualizations for transactions, payment links, and transfers directly in your MCP client.

![Flutterwave MCP-UI Components](https://github.com/user-attachments/assets/d3996cdf-acfd-4bea-81cf-aa7d454a59a6)

### UI Features
- 🎨 **Flutterwave-branded components** with signature orange (#F5A623) gradient
- 💳 **Transaction details** with status badges and formatted amounts
- 🔗 **Payment links** with copy-friendly display and direct links
- 💸 **Transfer details** with beneficiary information
- 📊 **Transaction timeline** visualization
- 📱 **Responsive design** that works across different screen sizes

## Features

- Confirm Transactions (Already included)
- Retry Failed Transactions (Automatically retry transactions with recoverable errors) [✓]
- Retrieve Transaction History (Fetch and analyze past transactions) [✓]
- Send Failed Hooks (Already included)
- Generate Payment Links [✓]
- Automated Customer Support (AI chatbot integrated with Flutterwave for transaction inquiries) [✓]
- Manage Transfers and Beneficiaries (Already included)[✓]
- **Rich UI Components** for transaction, checkout, and transfer visualizations [✓]

## Available Tools

All tools now return rich UI components in addition to text responses for an enhanced user experience:

- `get-transactions`: Get the final status of a transaction with a transaction ID (includes UI card)
- `resent-failed-webhook`: Resend failed webhook for a transaction
- `create-checkout`: Create a payment link for customers (includes UI card with clickable link)
- `disable-checkout`: Disable a checkout transaction link
- `retry-transaction`: Analyze and provide guidance for retrying a failed transaction
- `get-transaction-timeline`: Get the timeline/history of events for a transaction (includes UI timeline)
- `get-beneficiaries`: Get the list of beneficiaries for a transfer
- `get-transfers`: Get the list of transfers for a customer
- `create-transfer`: Create a transfer for a customer (includes UI card)
- `create-beneficiary`: Create a beneficiary for transfers

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
   - Enjoy rich UI visualizations for transaction details, payment links, and transfers!

## MCP-UI Compatibility

This server uses [@mcp-ui/server](https://www.npmjs.com/package/@mcp-ui/server) to provide rich UI components. The UI resources are compatible with:

- **MCP Inspector**: View and test UI components during development
- **Claude Desktop**: (Support may vary - check MCP-UI documentation for latest compatibility)
- **Other MCP clients**: Any MCP client that supports the UI resource type

### UI Resource Types

The server returns UI resources with `type: "resource"` containing HTML content that can be rendered by compatible MCP clients. The components feature:

- Flutterwave's brand colors and design language
- Responsive layouts that adapt to different screen sizes
- Interactive elements like clickable payment links
- Status indicators with appropriate colors (success: green, pending: orange, failed: red)

## Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on how to get started, development guidelines, and how to submit changes.

