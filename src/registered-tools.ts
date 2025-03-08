import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import get_transaction from "./tools/get_transaction.js";
import resend_failed_webhook from "./tools/resend_failed_webhook.js";


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
    name: "resent_failed_webhook",
    description: "Resent failed Webhook",
    inputSchema: transactionSchema,
    cb: resend_failed_webhook,
});

export default tools;
