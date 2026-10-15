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
});