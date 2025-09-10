import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import get_transaction from "./tools/get_transaction.js";
import resend_failed_webhook from "./tools/resend_failed_webhook.js";
import create_checkout from "./tools/create_checkout.js";
import disable_checkout from "./tools/disable_checkout.js";
import retry_transaction from "./tools/retry_transaction.js";
import get_transaction_timeline from "./tools/get_transaction_timeline.js";


const tools:any[] = [];

const transactionSchema = {
    tx_id: z.string().min(1, "Transaction ID is required").describe("Transaction ID"),
};

tools.push({
    name: "get-transactions",
    description: "Get the final status of a transaction with a transaction ID",
    inputSchema: transactionSchema,
    cb: get_transaction,
});

tools.push({
    name: "resent-failed-webhook",
    description: "Resent failed Webhook",
    inputSchema: transactionSchema,
    cb: resend_failed_webhook,
});

tools.push({
    name: "create-checkout",
    description: "Create a payment link",
    inputSchema: {
        tx_ref: z.string(),
        amount: z.string(),
        currency: z.string(),
        redirect_url: z.string(),
        customer: {
            email: z.string(),
            name: z.string(),
            phonenumber: z.string(),
        },
        customizations: {
            title: z.string(),
        },
        configurations: {
            session_duration: z.number().default(0),
            max_retry_attempt: z.number().default(3)
        }
    },
    cb: create_checkout
});

tools.push({
    name: "disable-checkout",
    description: "Disable a Checkout Transaction",
    inputSchema: {
        link: z.string().url(`Checkout url is invalid. pass valid checkout url.`)
    },
    cb: disable_checkout
});

tools.push({
    name: "retry-transaction",
    description: "Analyze and provide guidance for retrying a failed transaction",
    inputSchema: transactionSchema,
    cb: retry_transaction,
});

tools.push({
    name: "get-transaction-timeline",
    description: "Get the timeline/history of events for a transaction",
    inputSchema: transactionSchema,
    cb: get_transaction_timeline,
});

//{ 'checkout.create': {  } }

export default tools;
