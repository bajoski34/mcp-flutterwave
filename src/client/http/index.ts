import createClient from "openapi-fetch";
import type { paths as checkoutPaths } from "../types/v3/checkout.js";
import type { paths as transactionPaths } from "../types/v3/transactions.js";
import type { paths as planPaths } from "../types/v3/plans.js";
import authMiddlewareV3 from "../middleware/authMiddlewareV3.js";
import { config } from "../../config/index.js";

const FLW_API_VERSION = process.env.FLW_VERSION || config.flutterwave.version;
const FLW_API_BASE = `${config.flutterwave.apiUrl}/${FLW_API_VERSION}`;
const USER_AGENT = "flutterwave-mcp/0.1.0";

// Shared configuration for all clients to reduce memory overhead
const clientConfig = {
    baseUrl: FLW_API_BASE,
    headers: { "User-Agent": USER_AGENT }
};

// Create clients once and reuse them (singleton pattern)
let _transactionClient: ReturnType<typeof createClient<transactionPaths>> | null = null;
let _checkoutClient: ReturnType<typeof createClient<checkoutPaths>> | null = null;
let _planClient: ReturnType<typeof createClient<planPaths>> | null = null;

function getTransactionClient() {
    if (!_transactionClient) {
        _transactionClient = createClient<transactionPaths>(clientConfig);
        _transactionClient.use(authMiddlewareV3);
    }
    return _transactionClient;
}

function getCheckoutClient() {
    if (!_checkoutClient) {
        _checkoutClient = createClient<checkoutPaths>(clientConfig);
        _checkoutClient.use(authMiddlewareV3);
    }
    return _checkoutClient;
}

function getPlanClient() {
    if (!_planClient) {
        _planClient = createClient<planPaths>(clientConfig);
        _planClient.use(authMiddlewareV3);
    }
    return _planClient;
}

// Export getters to maintain singleton pattern
export const transactionClient = getTransactionClient();
export const checkoutClient = getCheckoutClient();
export const planClient = getPlanClient();

