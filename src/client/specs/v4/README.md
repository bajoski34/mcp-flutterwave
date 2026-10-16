# v4 OpenAPI spec fragments

These YAML files are **vendored/extracted** from Flutterwave's embedded OpenAPI definitions on the `reference/*.md` documentation pages — not hand-authored like the v3 specs in `../v3/`.

| File | Source page |
|---|---|
| `charge.yaml` | `reference/charges_post.md` |
| `charges-get.yaml` | `v4/reference/charges_get` |
| `payment-methods.yaml` | `reference/payment_methods_post.md` |
| `payment-methods-get.yaml` | `v4/reference/payment_methods_get` |
| `customers.yaml` | `v4/reference/customers_create` |
| `customers-get.yaml` | `v4/reference/customers_get` |
| `refunds.yaml` | `v4/reference/refunds_post` |
| `refunds-get.yaml` | `v4/reference/refunds_get` |
| `customers-list.yaml` | `v4/reference/customers_list` |
| `customers-search.yaml` | `v4/reference/customers_search` |
| `customers-update.yaml` | `v4/reference/customers_put` |
| `charges-list.yaml` | `v4/reference/charges_list` |
| `charges-update.yaml` | `v4/reference/charges_put` |
| `refunds-list.yaml` | `v4/reference/refunds_list` |
| `payment-methods-list.yaml` | `v4/reference/payment_methods_list` |
| `fees.yaml` | `v4/reference/fees_get` |
| `banks.yaml` | `v4/reference/banks_get` |
| `mobile-networks.yaml` | `v4/reference/mobile_networks_get` |
| `wallet-balance.yaml` | `v4/reference/fetch_currency_wallet_balance` |
| `wallet-balances.yaml` | `v4/reference/fetch_wallet_balances` |
| `wallet-statement.yaml` | `v4/reference/get_wallet_statement` |
| `wallet-lookup.yaml` | `v4/reference/wallet_account_resolve_post` |
| `settlements-list.yaml` | `v4/reference/settlement_list` |
| `settlements-get.yaml` | `v4/reference/settlement_get` |
| `chargebacks-list.yaml` | `v4/reference/chargebacks_list` |
| `chargebacks-get.yaml` | `v4/reference/chargebacks_get_by_id` |
| `chargebacks.yaml` | `v4/reference/chargebacks_post` |
| `chargebacks-update.yaml` | `v4/reference/chargeback_put` |
| `orders.yaml` | `v4/reference/orders_post` |
| `orders-get.yaml` | `v4/reference/orders_get` |
| `virtual-accounts.yaml` | `v4/reference/virtual_accounts_post` |
| `virtual-accounts-get.yaml` | `v4/reference/virtual_account_get` |
| `transfer-rates.yaml` | `v4/reference/transfer_rates_post` |
| `transfer-rates-get.yaml` | `v4/reference/transfer_rates_get` |
| `orchestration-direct-charge.yaml` | `v4/reference/orchestration_direct_charge_post` |
| `orchestration-direct-order.yaml` | `v4/reference/orchestration_direct_order_post` |
| `direct-transfers.yaml` | `v4/reference/direct_transfers_post` |
| `resend-webhook.yaml` | `v4/reference/resend_webhook` |
| `bank-branches.yaml` | `v4/reference/bank_branches_get` |
| `bank-account-resolve.yaml` | `v4/reference/bank_account_resolve_post` |
| `orders-list.yaml` | `v4/reference/orders_list` |
| `orders-update.yaml` | `v4/reference/orders_put` |
| `virtual-accounts-list.yaml` | `v4/reference/virtual_accounts_list` |
| `virtual-accounts-update.yaml` | `v4/reference/virtual_accounts_put` |
| `transfer-recipients-list.yaml` | `v4/reference/transfers_recipients_list` |
| `transfer-recipients.yaml` | `v4/reference/transfers_recipients_create` |
| `transfer-recipients-get.yaml` | `v4/reference/transfers_recipients_get` |
| `transfer-recipients-delete.yaml` | `v4/reference/transfers_recipients_delete` |
| `transfer-senders-list.yaml` | `v4/reference/transfers_senders_list` |
| `transfer-senders.yaml` | `v4/reference/transfers_senders_create` |
| `transfer-senders-get.yaml` | `v4/reference/transfers_senders_get` |
| `transfer-senders-delete.yaml` | `v4/reference/transfers_senders_delete` |

Provenance headers (source URL + fetch date) are preserved at the top of each file.

## What is not here

- **Encryption** — there is no separate encryption spec. The `encrypted_card_in` schema (field-level AES-256-GCM inputs) lives inside `payment-methods.yaml`.
- **Auth** — there is no OpenAPI spec for authentication. v4 auth uses an external Keycloak IDP (`idp.flutterwave.com`) outside the F4B API surface.
- **Webhooks** — the original embedded docs include a `webhooks:` block and matching payload schemas. Those payload schemas arrived with broken YAML indentation (duplicate keys under `properties:`), so the webhook section and its schemas were dropped from the vendored copies. Operation schemas used for tool generation are intact. Re-add webhooks when we have a clean re-extract.

## Code generation

v4 uses **[Orval](https://orval.dev/)** (not `openapi-typescript` / not `openapi-generator`) to emit Zod validators from these fragments.

```bash
npm run generate:v4
```

Also runs as part of `npm run build` (after v3 `build:types`). Commit the regenerated files under `src/client/generated/v4/` with any YAML changes.

Config: [`orval.config.ts`](../../../orval.config.ts) at the repo root.  
Output: [`src/client/generated/v4/*.zod.ts`](../../generated/v4/).

Do not edit the generated files by hand — change the YAML (or the Orval config) and re-run the command above.
