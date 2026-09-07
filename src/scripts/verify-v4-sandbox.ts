/**
 * Throwaway live-sandbox verification script for the v4 auth + encryption PoC.
 * Not part of the MCP server itself — run manually, not registered anywhere.
 *
 * Usage: node --env-file=.env build/scripts/verify-v4-sandbox.js
 */
import { getAccessToken } from "../client/authV4.js";
import { getV4BaseUrl } from "../client/environmentV4.js";
import { flwV4Fetch } from "../client/httpV4.js";
import { encryptCardFields } from "../client/encryptionV4.js";

function mask(value: string, visible = 8): string {
  return value.length <= visible ? "***" : value.slice(0, visible) + "...";
}

async function main() {
  console.log("== v4 sandbox verification ==");
  console.log("Base URL:", getV4BaseUrl());

  // 1. Auth
  console.log("\n[1/3] Requesting OAuth access token...");
  const token = await getAccessToken();
  console.log("  OK — token:", mask(token));

  // 2. Authenticated GET, proves base URL + bearer plumbing
  console.log("\n[2/3] GET /customers?page=1 ...");
  const customersRes = await flwV4Fetch("/customers?page=1");
  const customersBody = await customersRes.text();
  console.log("  Status:", customersRes.status, customersRes.statusText);
  console.log("  Body (first 300 chars):", customersBody.slice(0, 300));

  // 3. Encryption round-trip against the real backend
  console.log("\n[3/3] POST /payment-methods with encrypted card fields...");
  const encryptionKey = process.env.FLW_ENCRYPTION_KEY;
  if (!encryptionKey) {
    console.log("  SKIPPED — FLW_ENCRYPTION_KEY not set.");
  } else {
    const encrypted = encryptCardFields(
      {
        cardNumber: "4187427415564246",
        cvv: "828",
        expiryMonth: "09",
        expiryYear: "32",
      },
      encryptionKey,
    );

    const pmRes = await flwV4Fetch("/payment-methods", {
      method: "POST",
      body: JSON.stringify({ type: "card", card: encrypted }),
    });
    const pmBody = await pmRes.text();
    console.log("  Status:", pmRes.status, pmRes.statusText);
    console.log("  Body:", pmBody);

    if (pmBody.includes("CLIENT_ENCRYPTION_ERROR")) {
      console.log(
        "\n  ⚠️  ENCRYPTION FORMAT REJECTED — the IV/AES-GCM assumption is WRONG. Needs fixing.",
      );
    } else if (pmRes.ok) {
      console.log(
        "\n  ✅ ENCRYPTION FORMAT ACCEPTED — payment method created successfully.",
      );
    } else {
      console.log(
        "\n  ℹ️  Non-encryption error (not CLIENT_ENCRYPTION_ERROR) — encryption format likely fine, this is a different validation issue. See body above.",
      );
    }
  }

  console.log("\n== done ==");
}

main().catch((err) => {
  console.error("\n❌ Verification script failed:", err);
  process.exit(1);
});
