import createClient from "openapi-fetch";
import type { paths as checkoutPaths } from "../types/v3/checkout.js";
import type { paths as transactionPaths } from "../types/v3/transactions.js";
import type { paths as transferPaths } from "../types/v3/transfer.js";
import type { paths as planPaths } from "../types/v3/plans.js";
import type { paths as chargePaths } from "../types/v3/charge.js";
import type { paths as virtualAccountPaths } from "../types/v3/virtual-account.js";
import type { paths as billPaymentPaths } from "../types/v3/bill-payment.js";
import type { paths as fxTradePaths } from "../types/v3/fx-trade.js";
import type { paths as verificationPaths } from "../types/v3/verification.js";
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

// Create singleton clients - initialized once and reused throughout the application
const transactionClient = createClient<transactionPaths>(clientConfig);
transactionClient.use(authMiddlewareV3);

const checkoutClient = createClient<checkoutPaths>(clientConfig);
checkoutClient.use(authMiddlewareV3);

const planClient = createClient<planPaths>(clientConfig);
planClient.use(authMiddlewareV3);

const transferClient = createClient<transferPaths>(clientConfig);
transferClient.use(authMiddlewareV3);

const chargeClient = createClient<chargePaths>(clientConfig);
chargeClient.use(authMiddlewareV3);

const virtualAccountClient = createClient<virtualAccountPaths>(clientConfig);
virtualAccountClient.use(authMiddlewareV3);

const billPaymentClient = createClient<billPaymentPaths>(clientConfig);
billPaymentClient.use(authMiddlewareV3);

const fxTradeClient = createClient<fxTradePaths>(clientConfig);
fxTradeClient.use(authMiddlewareV3);

const verificationClient = createClient<verificationPaths>(clientConfig);
verificationClient.use(authMiddlewareV3);

export {
    transactionClient,
    checkoutClient,
    planClient,
    transferClient,
    chargeClient,
    virtualAccountClient,
    billPaymentClient,
    fxTradeClient,
    verificationClient,
};

