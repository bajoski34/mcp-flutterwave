import createClient from "openapi-fetch";
import type { paths as checkoutPaths } from "../types/v3/checkout.js";
import type { paths as transactionPaths } from "../types/v3/transactions.js";
import type { paths as planPaths } from "../types/v3/plans.js";
import authMiddlewareV3 from "../middleware/authMiddlewareV3.js";
import { config } from "../../config/index.js";

const FLW_API_VERSION = process.env.FLW_VERSION || config.flutterwave.version;
const FLW_API_BASE = config.flutterwave.apiUrl + '/' + FLW_API_VERSION;
const USER_AGENT = "flutterwave-mcp/0.1.0";
 
const transactionClient = createClient<transactionPaths>({ baseUrl: FLW_API_BASE, headers: { "User-Agent": USER_AGENT } });
transactionClient.use(authMiddlewareV3);
const checkoutClient = createClient<checkoutPaths>({ baseUrl: FLW_API_BASE, headers: { "User-Agent": USER_AGENT } });
checkoutClient.use(authMiddlewareV3);
const planClient = createClient<planPaths>({ baseUrl: FLW_API_BASE, headers: { "User-Agent": USER_AGENT } });
planClient.use(authMiddlewareV3);

export {
    transactionClient,
    checkoutClient,
    planClient
}

