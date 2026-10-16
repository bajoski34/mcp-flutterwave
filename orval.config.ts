import { defineConfig } from "orval";

/**
 * v4 OpenAPI → Zod schema generation.
 *
 * Input: vendored fragments under src/client/specs/v4/ (see that README
 * for provenance). Output: Zod validators under src/client/generated/v4/,
 * consumed later when wiring MCP tools.
 *
 * Regenerate: npm run generate:v4
 *
 * Why Orval (vs openapi-generator): Node-native (no JVM), Zod output for
 * tool-arg validation, fits the existing openapi-typescript/openapi-fetch
 * TypeScript tooling stack. See #33.
 */
const zodOutput = (target: string) =>
  ({
    client: "zod" as const,
    mode: "single" as const,
    target,
    override: {
      zod: {
        // Repo depends on zod@3; pin so CI/local output stays identical.
        version: 3 as const,
        // MCP tools need request validation (body/header/param/query).
        // Skip response schemas for now — Flutterwave's processor_response
        // enum-of-objects emits invalid zod.literal({…}) under zod@3.
        generate: {
          body: true,
          header: true,
          param: true,
          query: true,
          response: false,
        },
      },
    },
  });

export default defineConfig({
  flutterwaveV4Charges: {
    input: { target: "./src/client/specs/v4/charge.yaml" },
    output: zodOutput("./src/client/generated/v4/charge.zod.ts"),
  },
  flutterwaveV4PaymentMethods: {
    input: { target: "./src/client/specs/v4/payment-methods.yaml" },
    output: zodOutput("./src/client/generated/v4/payment-methods.zod.ts"),
  },
  flutterwaveV4Customers: {
    input: { target: "./src/client/specs/v4/customers.yaml" },
    output: zodOutput("./src/client/generated/v4/customers.zod.ts"),
  },
  flutterwaveV4ChargesGet: {
    input: { target: "./src/client/specs/v4/charges-get.yaml" },
    output: zodOutput("./src/client/generated/v4/charges-get.zod.ts"),
  },
  flutterwaveV4Refunds: {
    input: { target: "./src/client/specs/v4/refunds.yaml" },
    output: zodOutput("./src/client/generated/v4/refunds.zod.ts"),
  },
  flutterwaveV4CustomersGet: {
    input: { target: "./src/client/specs/v4/customers-get.yaml" },
    output: zodOutput("./src/client/generated/v4/customers-get.zod.ts"),
  },
  flutterwaveV4RefundsGet: {
    input: { target: "./src/client/specs/v4/refunds-get.yaml" },
    output: zodOutput("./src/client/generated/v4/refunds-get.zod.ts"),
  },
  flutterwaveV4PaymentMethodsGet: {
    input: { target: "./src/client/specs/v4/payment-methods-get.yaml" },
    output: zodOutput("./src/client/generated/v4/payment-methods-get.zod.ts"),
  },
  flutterwaveV4CustomersList: {
    input: { target: "./src/client/specs/v4/customers-list.yaml" },
    output: zodOutput("./src/client/generated/v4/customers-list.zod.ts"),
  },
  flutterwaveV4CustomersSearch: {
    input: { target: "./src/client/specs/v4/customers-search.yaml" },
    output: zodOutput("./src/client/generated/v4/customers-search.zod.ts"),
  },
  flutterwaveV4CustomersUpdate: {
    input: { target: "./src/client/specs/v4/customers-update.yaml" },
    output: zodOutput("./src/client/generated/v4/customers-update.zod.ts"),
  },
  flutterwaveV4ChargesList: {
    input: { target: "./src/client/specs/v4/charges-list.yaml" },
    output: zodOutput("./src/client/generated/v4/charges-list.zod.ts"),
  },
  flutterwaveV4ChargesUpdate: {
    input: { target: "./src/client/specs/v4/charges-update.yaml" },
    output: zodOutput("./src/client/generated/v4/charges-update.zod.ts"),
  },
  flutterwaveV4RefundsList: {
    input: { target: "./src/client/specs/v4/refunds-list.yaml" },
    output: zodOutput("./src/client/generated/v4/refunds-list.zod.ts"),
  },
  flutterwaveV4PaymentMethodsList: {
    input: { target: "./src/client/specs/v4/payment-methods-list.yaml" },
    output: zodOutput("./src/client/generated/v4/payment-methods-list.zod.ts"),
  },
  flutterwaveV4Fees: {
    input: { target: "./src/client/specs/v4/fees.yaml" },
    output: zodOutput("./src/client/generated/v4/fees.zod.ts"),
  },
  flutterwaveV4Banks: {
    input: { target: "./src/client/specs/v4/banks.yaml" },
    output: zodOutput("./src/client/generated/v4/banks.zod.ts"),
  },
  flutterwaveV4MobileNetworks: {
    input: { target: "./src/client/specs/v4/mobile-networks.yaml" },
    output: zodOutput("./src/client/generated/v4/mobile-networks.zod.ts"),
  },
  flutterwaveV4WalletBalance: {
    input: { target: "./src/client/specs/v4/wallet-balance.yaml" },
    output: zodOutput("./src/client/generated/v4/wallet-balance.zod.ts"),
  },
  flutterwaveV4WalletBalances: {
    input: { target: "./src/client/specs/v4/wallet-balances.yaml" },
    output: zodOutput("./src/client/generated/v4/wallet-balances.zod.ts"),
  },
  flutterwaveV4WalletStatement: {
    input: { target: "./src/client/specs/v4/wallet-statement.yaml" },
    output: zodOutput("./src/client/generated/v4/wallet-statement.zod.ts"),
  },
  flutterwaveV4WalletLookup: {
    input: { target: "./src/client/specs/v4/wallet-lookup.yaml" },
    output: zodOutput("./src/client/generated/v4/wallet-lookup.zod.ts"),
  },
  flutterwaveV4SettlementsList: {
    input: { target: "./src/client/specs/v4/settlements-list.yaml" },
    output: zodOutput("./src/client/generated/v4/settlements-list.zod.ts"),
  },
  flutterwaveV4SettlementsGet: {
    input: { target: "./src/client/specs/v4/settlements-get.yaml" },
    output: zodOutput("./src/client/generated/v4/settlements-get.zod.ts"),
  },
  flutterwaveV4ChargebacksList: {
    input: { target: "./src/client/specs/v4/chargebacks-list.yaml" },
    output: zodOutput("./src/client/generated/v4/chargebacks-list.zod.ts"),
  },
  flutterwaveV4ChargebacksGet: {
    input: { target: "./src/client/specs/v4/chargebacks-get.yaml" },
    output: zodOutput("./src/client/generated/v4/chargebacks-get.zod.ts"),
  },
  flutterwaveV4Chargebacks: {
    input: { target: "./src/client/specs/v4/chargebacks.yaml" },
    output: zodOutput("./src/client/generated/v4/chargebacks.zod.ts"),
  },
  flutterwaveV4ChargebacksUpdate: {
    input: { target: "./src/client/specs/v4/chargebacks-update.yaml" },
    output: zodOutput("./src/client/generated/v4/chargebacks-update.zod.ts"),
  },
  flutterwaveV4Orders: {
    input: { target: "./src/client/specs/v4/orders.yaml" },
    output: zodOutput("./src/client/generated/v4/orders.zod.ts"),
  },
  flutterwaveV4OrdersGet: {
    input: { target: "./src/client/specs/v4/orders-get.yaml" },
    output: zodOutput("./src/client/generated/v4/orders-get.zod.ts"),
  },
  flutterwaveV4VirtualAccounts: {
    input: { target: "./src/client/specs/v4/virtual-accounts.yaml" },
    output: zodOutput("./src/client/generated/v4/virtual-accounts.zod.ts"),
  },
  flutterwaveV4VirtualAccountsGet: {
    input: { target: "./src/client/specs/v4/virtual-accounts-get.yaml" },
    output: zodOutput("./src/client/generated/v4/virtual-accounts-get.zod.ts"),
  },
  flutterwaveV4TransferRates: {
    input: { target: "./src/client/specs/v4/transfer-rates.yaml" },
    output: zodOutput("./src/client/generated/v4/transfer-rates.zod.ts"),
  },
  flutterwaveV4TransferRatesGet: {
    input: { target: "./src/client/specs/v4/transfer-rates-get.yaml" },
    output: zodOutput("./src/client/generated/v4/transfer-rates-get.zod.ts"),
  },
  flutterwaveV4OrchestrationDirectCharge: {
    input: { target: "./src/client/specs/v4/orchestration-direct-charge.yaml" },
    output: zodOutput("./src/client/generated/v4/orchestration-direct-charge.zod.ts"),
  },
  flutterwaveV4OrchestrationDirectOrder: {
    input: { target: "./src/client/specs/v4/orchestration-direct-order.yaml" },
    output: zodOutput("./src/client/generated/v4/orchestration-direct-order.zod.ts"),
  },
  flutterwaveV4DirectTransfers: {
    input: { target: "./src/client/specs/v4/direct-transfers.yaml" },
    output: zodOutput("./src/client/generated/v4/direct-transfers.zod.ts"),
  },
  flutterwaveV4ResendWebhook: {
    input: { target: "./src/client/specs/v4/resend-webhook.yaml" },
    output: zodOutput("./src/client/generated/v4/resend-webhook.zod.ts"),
  },
  flutterwaveV4BankBranches: {
    input: { target: "./src/client/specs/v4/bank-branches.yaml" },
    output: zodOutput("./src/client/generated/v4/bank-branches.zod.ts"),
  },
  flutterwaveV4BankAccountResolve: {
    input: { target: "./src/client/specs/v4/bank-account-resolve.yaml" },
    output: zodOutput("./src/client/generated/v4/bank-account-resolve.zod.ts"),
  },
  flutterwaveV4OrdersList: {
    input: { target: "./src/client/specs/v4/orders-list.yaml" },
    output: zodOutput("./src/client/generated/v4/orders-list.zod.ts"),
  },
  flutterwaveV4OrdersUpdate: {
    input: { target: "./src/client/specs/v4/orders-update.yaml" },
    output: zodOutput("./src/client/generated/v4/orders-update.zod.ts"),
  },
  flutterwaveV4VirtualAccountsList: {
    input: { target: "./src/client/specs/v4/virtual-accounts-list.yaml" },
    output: zodOutput("./src/client/generated/v4/virtual-accounts-list.zod.ts"),
  },
  flutterwaveV4VirtualAccountsUpdate: {
    input: { target: "./src/client/specs/v4/virtual-accounts-update.yaml" },
    output: zodOutput("./src/client/generated/v4/virtual-accounts-update.zod.ts"),
  },
  flutterwaveV4TransferRecipientsList: {
    input: { target: "./src/client/specs/v4/transfer-recipients-list.yaml" },
    output: zodOutput("./src/client/generated/v4/transfer-recipients-list.zod.ts"),
  },
  flutterwaveV4TransferRecipients: {
    input: { target: "./src/client/specs/v4/transfer-recipients.yaml" },
    output: zodOutput("./src/client/generated/v4/transfer-recipients.zod.ts"),
  },
  flutterwaveV4TransferRecipientsGet: {
    input: { target: "./src/client/specs/v4/transfer-recipients-get.yaml" },
    output: zodOutput("./src/client/generated/v4/transfer-recipients-get.zod.ts"),
  },
  flutterwaveV4TransferRecipientsDelete: {
    input: { target: "./src/client/specs/v4/transfer-recipients-delete.yaml" },
    output: zodOutput("./src/client/generated/v4/transfer-recipients-delete.zod.ts"),
  },
});