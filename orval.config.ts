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
});
