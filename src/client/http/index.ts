import createClient from "openapi-fetch";
import type { paths as checkoutPaths } from "../types/v3/checkout.js";
import type { paths as transactionPaths } from "../types/v3/transactions.js";
import authMiddlewareV3 from "../middleware/authMiddlewareV3.js";

const FLW_API_VERSION = process.env.FLW_VERSION || 'v3';
const FLW_API_BASE = "https://api.flutterwave.com/" + FLW_API_VERSION;
const USER_AGENT = "flutterwave-mcp/0.1.0";
 
const transactionClient = createClient<transactionPaths>({ baseUrl: FLW_API_BASE, headers: { "User-Agent": USER_AGENT } });
transactionClient.use(authMiddlewareV3);
const checkoutClient = createClient<checkoutPaths>({ baseUrl: FLW_API_BASE, headers: { "User-Agent": USER_AGENT } });
checkoutClient.use(authMiddlewareV3);

export {
    transactionClient,
    checkoutClient
}

