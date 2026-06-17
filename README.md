# mcp-flutterwave

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that enables AI assistants to interact with the Flutterwave API — create payment links, charge customers directly, manage transfers, collect via virtual accounts, pay bills, and more.

> **Note:** This server currently targets the Flutterwave v3 API. Support for v4 is coming soon.

Also ships with a **built-in web app** that connects to the MCP server and lets you talk to a Claude-powered Flutterwave assistant directly in your browser.

---

## Contents

- [Features](#features)
- [Available Tools](#available-tools)
- [Card Charge Flow](#card-charge-flow)
- [Virtual Accounts](#virtual-accounts)
- [Bill Payment Flow](#bill-payment-flow)
- [FX Trade Flow](#fx-trade-flow)
- [Verification](#verification)
- [Stablecoins](#stablecoins)
- [Web App](#web-app)
- [MCP Server Setup](#mcp-server-setup)
- [Usage with Claude Desktop](#usage-with-claude-desktop)
- [MCP-UI Components](#mcp-ui-components)
- [Contributing](#contributing)

---

## Features

- **Checkout** — Create hosted payment links and disable them
- **Direct Charges** — Charge customers via card, bank account, mobile money, M-Pesa, or USSD
- **Full card auth flow** — PIN, AVS (Address Verification), 3D Secure redirect, and OTP validation all handled automatically
- **Charge Validation** — Validate OTP-based charges with a dedicated tool
- **Transactions** — Verify by ID or reference, view event timeline, resend failed webhooks
- **Transfers** — Initiate single transfers, manage beneficiaries
- **Payment Plans** — Create and retrieve subscription plans
- **Virtual Accounts** — Generate dedicated account numbers for NGN and GHS bank transfer collection (static or dynamic)
- **Bill Payments** — Pay airtime, data, cable TV, electricity, internet bills and more (Nigeria)
- **FX Trade** — Convert between NGN, GHS, and USD with live quotes (RFQ → trade in two steps)
- **Verification** — BVN identity verification, bank account name resolution, and card BIN lookup
- **Stablecoins** — Send USDC/USDT to Polygon wallets, or convert NGN/USD fiat into stablecoins
- **Rich UI** — Every tool returns a branded HTML card rendered inline in supported clients
- **Web App** — A standalone browser chat interface powered by Claude + this MCP server

---

## Available Tools

### Checkout
| Tool | Description |
|---|---|
| `create_checkout` | Create a hosted Flutterwave payment link |
| `disable_checkout` | Disable an existing payment link |

### Direct Charges
| Tool | Description |
|---|---|
| `charge_card` | Directly charge a debit or credit card — handles PIN, AVS, 3DS, and OTP flows |
| `charge_bank_account` | Debit a bank account (NGN / GHS) |
| `charge_mobile_money` | Mobile money — Ghana, Uganda, Rwanda, Zambia, Francophone Africa |
| `charge_mpesa` | M-Pesa charge (KES) |
| `charge_ussd` | USSD charge (NGN) |
| `validate_charge` | Validate a pending charge using OTP |

### Transactions
| Tool | Description |
|---|---|
| `read_transaction` | Get transaction details by ID |
| `read_transaction_with_reference` | Get transaction details by `tx_ref` |
| `read_transaction_timeline` | View the event timeline for a transaction |
| `resend_transaction_webhook` | Resend a failed webhook |

### Transfers
| Tool | Description |
|---|---|
| `create_transfer` | Initiate a bank transfer |
| `create_beneficiary` | Save a new transfer beneficiary |
| `list_beneficiaries` | List all saved beneficiaries |

### Payment Plans
| Tool | Description |
|---|---|
| `create_payment_plan` | Create a recurring payment plan |
| `get_payment_plans` | List payment plans with optional filters |

### Virtual Accounts
| Tool | Description |
|---|---|
| `create_virtual_account` | Create a dedicated bank account number for a customer (NGN or GHS) |
| `get_virtual_account` | Retrieve a virtual account's status and details by `order_ref` |
| `update_virtual_account` | Link or update the BVN on an NGN virtual account |
| `list_virtual_account_bulk` | List all accounts created in a bulk batch |

### Bill Payments
| Tool | Description |
|---|---|
| `get_bill_categories` | List available bill categories (AIRTIME, CABLEBILLS, UTILITYBILLS, etc.) |
| `get_bill_providers` | List billers/providers for a category |
| `get_bill_items` | List payable items for a specific biller |
| `validate_bill_customer` | Validate a customer account before payment (meter number, smartcard, etc.) |
| `pay_bill` | Submit a bill payment |
| `get_bill_status` | Check payment status and retrieve prepaid tokens (electricity) |

### FX Trade
| Tool | Description |
|---|---|
| `request_fx_quote` | Submit a Request For Quote (RFQ) for a currency conversion |
| `get_fx_quote` | Poll the quote status — wait for READY before trading |
| `initiate_fx_trade` | Lock in a READY quote and execute the trade |
| `get_fx_trade` | Poll trade status until SETTLED or FAILED |

### Verification
| Tool | Description |
|---|---|
| `initiate_bvn_verification` | Begin a BVN identity check — returns a single-use customer consent URL |
| `get_bvn_details` | Retrieve full BVN identity data after consent is given |
| `resolve_bank_account` | Look up the account holder name for a bank account number |
| `verify_card_bin` | Look up card brand, type, issuer, and country from the first 6 digits |

### Stablecoins
| Tool | Description |
|---|---|
| `get_stablecoin_fee` | Get the transfer fee before sending — shows net amount the recipient receives |
| `send_stablecoin` | Send USDC or USDT to a Polygon wallet address |
| `convert_to_stablecoin` | Convert NGN or USD fiat balance into USDC or USDT |

---

## Card Charge Flow

Direct card charges are multi-step. The `charge_card` tool handles every stage automatically and tells Claude what to do next.

```
1. charge_card(card details)
        │
        ├─ mode: "pin"        → ask customer for PIN
        │       charge_card(same params + authorization: { mode: "pin", pin: "..." })
        │               │
        │               ├─ mode: "otp"      → validate_charge(flw_ref, otp)
        │               └─ mode: "redirect" → send customer to 3DS URL
        │
        ├─ mode: "avs_noauth" → ask customer for billing address
        │       charge_card(same params + authorization: { mode: "avs_noauth", city, address, ... })
        │               │
        │               ├─ mode: "otp"      → validate_charge(flw_ref, otp)
        │               └─ mode: "redirect" → send customer to 3DS URL
        │
        ├─ mode: "redirect"   → send customer to 3DS URL, then read_transaction to verify
        │
        └─ (none)             → charge complete — read_transaction to verify
```

### Authorization parameters

When a second call is needed, pass `authorization` alongside the original card details:

```json
// PIN flow
{ "authorization": { "mode": "pin", "pin": "3310" } }

// AVS flow
{ "authorization": { "mode": "avs_noauth", "city": "Lagos", "address": "12 Victoria Island", "state": "LA", "country": "NG", "zipcode": "100001" } }
```

### AMEX cards

American Express transactions require the `card_holder_name` field in addition to standard card details.

### Payload encryption

Card payloads are encrypted with 3DES-ECB using your `FLW_ENCRYPTION_KEY` before they are sent to Flutterwave (PCI DSS requirement). The encryption is handled automatically — set the environment variable and the server does the rest.

---

## Virtual Accounts

Virtual accounts give each customer a dedicated bank account number to make transfers into. Flutterwave notifies your webhook when a payment arrives.

| Feature | NGN | GHS |
|---|---|---|
| Dynamic (one-time) | ✓ — set `amount`, expires in ~1 hr | ✓ — use `frequency` and `duration` |
| Static (reusable) | ✓ — `is_permanent: true`, **BVN required** | ✓ — `is_permanent: true` |
| BVN required | Static accounts only | No |

### NGN static account

```json
{
  "email": "customer@example.com",
  "currency": "NGN",
  "tx_ref": "VA-NGN-001",
  "is_permanent": true,
  "bvn": "22415929481"
}
```

### GHS dynamic account

```json
{
  "email": "customer@example.com",
  "currency": "GHS",
  "tx_ref": "VA-GHS-001",
  "amount": 500,
  "frequency": 5,
  "duration": 7
}
```

After creation, save the `order_ref` — it is the key for retrieving or updating the account via `get_virtual_account` and `update_virtual_account`.

---

## Bill Payment Flow

Bill payments follow a 6-step discovery flow. Skip `validate_bill_customer` for airtime and mobile data.

```
1. get_bill_categories
        ↓ choose a category (e.g. UTILITYBILLS)

2. get_bill_providers(category)
        ↓ get biller_code (e.g. "BIL127" for IKEDC)

3. get_bill_items(biller_code)
        ↓ get item_code and amount info

4. validate_bill_customer(item_code, customer_id)   ← skip for AIRTIME / MOBILEDATA
        ↓ confirm customer name and details

5. pay_bill(biller_code, item_code, customer_id, amount)
        ↓ returns reference

6. get_bill_status(reference)
        ↓ confirms completion
          for electricity: prepaid token is in extra.token — share it with the customer
```

### Supported categories

| Code | Description |
|---|---|
| `AIRTIME` | Mobile airtime top-up |
| `MOBILEDATA` | Data bundle purchase |
| `CABLEBILLS` | Cable TV (DSTV, GOTV, StarTimes) |
| `INTSERVICE` | Internet service subscriptions |
| `UTILITYBILLS` | Electricity (prepaid & postpaid) |
| `TAX` | Government tax payments |
| `DONATIONS` | Charitable donations |
| `TRANSLOG` | Transport / logistics |
| `DEALPAY` | Deal payments |
| `RELINST` | Religious institutions |
| `SCHPB` | School / education payments |

> Bill payments are available for Nigeria only (`country: NG`).

---

## FX Trade Flow

Currency conversion uses a two-step quote-then-trade flow. Quotes are valid for **5 minutes** and available **weekdays only** (Monday–Friday).

```
1. request_fx_quote(base_currency, target_currency, quantity)
        ↓ returns quote_id, status: NEW

2. get_fx_quote(quote_id)   ← poll until READY or FAILED
        ↓ READY: contains rate, approved_quantity, total_value, expiry

3. initiate_fx_trade(quote_id, narration)
        ↓ locks in rate, returns trade_id, status: NEW

4. get_fx_trade(trade_id)   ← poll until SETTLED or FAILED
        ↓ SETTLED: converted funds credited to target currency wallet instantly
```

### Supported currency pairs

| Pair | Sell | Receive |
|---|---|---|
| NGN/USD | Nigerian Naira | US Dollar |
| GHS/USD | Ghanaian Cedi | US Dollar |
| USD/NGN | US Dollar | Nigerian Naira |

### Quote statuses

| Status | Meaning |
|---|---|
| `NEW` | Quote is being priced |
| `READY` | Rate locked — call `initiate_fx_trade` now |
| `PROCESSING` | A trade has been initiated on this quote |
| `EXPIRED` | 5-minute window passed — submit a new quote |
| `FAILED` | Pair unsupported, minimum not met, or account limit exceeded |

### Trade statuses

| Status | Meaning |
|---|---|
| `NEW` | Trade queued |
| `PENDING` | Executing |
| `SETTLED` | Funds exchanged and credited to target currency wallet |
| `FAILED` | Insufficient balance or processing error |

### Key constraints

- **Minimum trade:** $1,000 USD equivalent in the base currency
- **Quote lifetime:** 5 minutes from issuance (READY state)
- **One-time use:** Each quote can only be used for one trade
- **Approved quantity:** May differ from requested quantity due to liquidity or account limits — always use `approved_quantity` for reconciliation
- **Account enablement:** Contact hi@flutterwavego.com to enable FX trading on your account

---

## Verification

### Bank Account Resolution

Verify a recipient's account details before sending a transfer. Always show the resolved name to the user before proceeding.

```json
{ "account_number": "0690000040", "account_bank": "044" }
```

Common bank codes: `044` Access Bank · `057` Zenith Bank · `058` GTBank · `033` UBA · `011` First Bank

### Card BIN Lookup

Identify card metadata from the first 6 digits of a card number.

```json
{ "bin": "553188" }
// → { brand: "MASTERCARD", type: "CREDIT", issuer: "NEXUS MERCHANT BANK", country: "NIGERIA" }
```

> AMEX cards identified via BIN require the `card_holder_name` field when calling `charge_card`.

### BVN Verification (Nigeria)

Two-step consent flow — customer must approve data sharing on the NIBSS portal.

```
1. initiate_bvn_verification(bvn, firstname, lastname, redirect_url)
        ↓ returns reference + single-use consent URL

2. Customer visits consent URL → approves data sharing on NIBSS portal
        ↓ webhook (bvn.completed) fires OR poll:

3. get_bvn_details(reference)
        ↓ returns name, DOB, gender, phone, NIN, state of origin, watchlist status
```

> Requires Flutterwave account enablement — contact hi@flutterwavego.com. If the customer has already consented, `initiate_bvn_verification` returns `url: null` and you can call `get_bvn_details` immediately.

---

## Stablecoins

Send USDC or USDT over the **Polygon network**, or convert NGN/USD fiat balances into stablecoins. Always call `get_stablecoin_fee` first so the user knows the net amount the recipient will receive.

### Wallet-to-wallet transfer

```
1. get_stablecoin_fee(amount, currency: "USDT", debit_currency: "USDT")
        ↓ shows fee and net amount

2. send_stablecoin(wallet_address, amount, currency, debit_currency)
        ↓ returns reference and transfer status
```

### Fiat-to-stablecoin conversion

```
1. get_stablecoin_fee(amount, currency: "USDC", debit_currency: "NGN")
        ↓ shows fee (percentage-based) and net USDC amount

2. convert_to_stablecoin(merchant_id, amount, currency, debit_currency: "NGN")
        ↓ deducts NGN from your fiat wallet, credits USDC/USDT
```

### Key constraints

| Constraint | Detail |
|---|---|
| **Network** | Polygon only — no Tron, Solana, or Stellar |
| **Coins** | USDC and USDT |
| **Wallet format** | EVM address: `0x` + 40 hex characters (42 total) |
| **Fiat sources** | NGN or USD for `convert_to_stablecoin`; stablecoin must match `currency` for `send_stablecoin` |
| **Fee type** | Flat fee for same-currency; percentage fee for fiat → stablecoin |

---

## Web App

The `app/` directory contains a standalone browser chat interface that wraps this MCP server with a Claude-powered conversation loop.

![Flutterwave MCP-UI Components](https://github.com/user-attachments/assets/d3996cdf-acfd-4bea-81cf-aa7d454a59a6)

### How it works

```
Browser  →  POST /api/chat
               ↓
           Claude (Sonnet) — all MCP tools injected via advanced-tool-use beta
               ↓  tool_use
           MCP Server (this repo, spawned via stdio)
               ↓
           Flutterwave API
```

The web app uses three Anthropic Advanced Tool Use features:

- **Tool Search** — non-core tools are deferred and loaded on demand, reducing token usage by ~85%
- **Programmatic Tool Calling** — Claude can write code that calls multiple tools in sequence without inflating the conversation context
- **Tool Use Examples** — curated `input_examples` for every tool improve parameter accuracy from ~72% to ~90%

The app returns a rich branded UI card for every tool response — checkout links, transaction details, charge states, transfer summaries, virtual accounts, bill receipts — rendered inline in the chat.

### Running the web app

**Prerequisites**

| Variable | Required | Description |
|---|---|---|
| `FLW_SECRET_KEY` | Yes | Your Flutterwave secret key |
| `FLW_ENCRYPTION_KEY` | For card charges | Your Flutterwave encryption key |
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |

Get your keys from the [Flutterwave Dashboard](https://dashboard.flutterwave.com) under **Settings → API Keys**.  
Get your Anthropic key from the [Anthropic Console](https://console.anthropic.com).

**Build and start**

```bash
# Clone and install
git clone https://github.com/bajoski34/mcp-flutterwave.git
cd mcp-flutterwave
npm install

# Build both the MCP server and the web app
npm run build:all

# Start
ANTHROPIC_API_KEY=sk-ant-... FLW_SECRET_KEY=FLWSECK_... npm run start:app
```

Then open [http://localhost:3000](http://localhost:3000).

**Available scripts**

| Script | Description |
|---|---|
| `npm run build` | Build the MCP server only |
| `npm run build:app` | Build the web app only |
| `npm run build:all` | Build everything |
| `npm run start:app` | Start the web app (requires a prior build) |
| `npm run dev:app` | Build everything then start the web app |
| `npm test` | Run the test suite |

**Port**

Set the `PORT` environment variable to change from the default `3000`.

---

## MCP Server Setup

### Via npm

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

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `FLW_SECRET_KEY` | Yes | Your Flutterwave secret key |
| `FLW_ENCRYPTION_KEY` | For card charges | Your Flutterwave encryption key (from Dashboard → Settings → API) |

---

## Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`. See the [MCP quickstart](https://modelcontextprotocol.io/quickstart/user) for details.

Pass `--tools=all` to enable every tool, or supply a comma-separated list to restrict which tools are registered.

### Via npm

```json
{
  "mcpServers": {
    "flutterwave": {
      "command": "mcp-flutterwave",
      "args": ["--tools=all"],
      "env": {
        "FLW_SECRET_KEY": "YOUR_SECRET_KEY",
        "FLW_ENCRYPTION_KEY": "YOUR_ENCRYPTION_KEY"
      }
    }
  }
}
```

### Via local build

```json
{
  "mcpServers": {
    "flutterwave": {
      "command": "node",
      "args": [
        "/path/to/mcp-flutterwave/build/index.js",
        "--tools=all"
      ],
      "env": {
        "FLW_SECRET_KEY": "YOUR_SECRET_KEY",
        "FLW_ENCRYPTION_KEY": "YOUR_ENCRYPTION_KEY"
      }
    }
  }
}
```

### Selective tools

```json
"args": [
  "--tools=create_checkout,read_transaction,create_transfer"
]
```

**Accepted tool names** (use `all` to enable everything):

```
create_checkout            disable_checkout
read_transaction           read_transaction_with_reference
read_transaction_timeline  resend_transaction_webhook
create_transfer            create_beneficiary            list_beneficiaries
create_payment_plan        get_payment_plans
charge_card                charge_bank_account           charge_mobile_money
charge_mpesa               charge_ussd                   validate_charge
create_virtual_account     get_virtual_account           update_virtual_account
list_virtual_account_bulk
get_bill_categories        get_bill_providers            get_bill_items
validate_bill_customer     pay_bill                      get_bill_status
request_fx_quote           get_fx_quote
initiate_fx_trade          get_fx_trade
initiate_bvn_verification  get_bvn_details
resolve_bank_account       verify_card_bin
get_stablecoin_fee         send_stablecoin               convert_to_stablecoin
```

---

## MCP-UI Components

Every tool returns a rich HTML card alongside its text response, powered by [@mcp-ui/server](https://www.npmjs.com/package/@mcp-ui/server). The cards use Flutterwave's design tokens — navy `#0A0E27`, deep orange `#FF5804`, brand orange `#F5A623`, and the system sans-serif typeface.

### Card charge UI states

| State | Card shown |
|---|---|
| PIN required | Step-by-step instructions, transaction reference |
| AVS required | Required billing address fields as chips |
| 3DS redirect | Bank authentication URL with a direct link |
| OTP required | Bank message, `flw_ref` to pass to `validate_charge` |
| Completed | Amount, status badge, transaction and Flutterwave references |

### Virtual account UI

The virtual account card shows the bank account number in a large, prominent box alongside the bank name, account type (Static / Dynamic), currency, expiry date, and order reference.

### Bill payment UI

| Tool | Card shown |
|---|---|
| `pay_bill` | Bill receipt — biller, item, customer ID, amount, status |
| `get_bill_status` | Status card with prepaid token (electricity) in large monospace text, with a share note |

### Verification UI

| Tool | Card shown |
|---|---|
| `initiate_bvn_verification` | Consent card — customer name (BVN last-4 only), single-use consent link with open button, step-by-step instructions |
| `get_bvn_details` | Identity card — name, DOB, gender, phone, NIN, state of origin; BVN partially masked; red watchlist badge if flagged |
| `resolve_bank_account` | Green verified card — account name in large text with account number and bank code |
| `verify_card_bin` | Brand-coloured card (Visa blue / Mastercard red / Amex blue / dark for others) — brand, type badge, issuer, country |

### Stablecoin UI

| Tool | Card shown |
|---|---|
| `get_stablecoin_fee` | Blue-themed fee card — coin pair, flat fee or percentage breakdown, net amount the recipient receives |
| `send_stablecoin` | Transfer card — truncated wallet address, amount, status badge |
| `convert_to_stablecoin` | Conversion card — fiat debit currency, target stablecoin, merchant ID, status |

### FX trade UI

Both `request_fx_quote`/`get_fx_quote` and `initiate_fx_trade`/`get_fx_trade` return dark navy-themed cards:

| State | Card shown |
|---|---|
| Quote NEW / PROCESSING | Instrument badge, status pill, poll instruction |
| Quote READY | Exchange rate, approved quantity, received amount, expiry, call-to-action |
| Quote FAILED / EXPIRED | Error message with reason |
| Trade NEW / PENDING | Amount in target currency, poll instruction |
| Trade SETTLED | Green settled banner, target currency amount, recipient, wallet credit note |
| Trade FAILED | Red failure banner with `response_message` |

Cards are compatible with:

- **Flutterwave Web App** (this repo's `app/`) — rendered inline in the chat
- **MCP Inspector** — for testing during development
- **Any MCP client** that supports the `resource` content type with HTML

---

## Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on how to get started, development guidelines, and how to submit pull requests.
