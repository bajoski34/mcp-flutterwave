import Flutterwave from "../client/index.js";
import { server } from "../server.js";
import { TransactionSchema } from "../types/transaction/schema.js";

// Cache transactions client to avoid repeated function calls
const transactionsClient = Flutterwave.transactions();

// Helper function to create error responses
function createErrorResponse(message: string) {
    return {
        content: [{ type: "text" as const, text: message }],
    };
}

// Helper function to validate API response
function isValidResponse(status: unknown, data: unknown): data is { status?: string } {
    return !(typeof status === 'number' && status >= 400) && !!data;
}

export async function getTransaction({ tx_id }: { tx_id: string }) {
    try {
        const { status, data } = await transactionsClient.get(tx_id) || { status: null, data: null };

        if (!isValidResponse(status, data) || !data.status) {
            return createErrorResponse(`Unable to retrieve ${tx_id}`);
        }

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Transaction Status: ${data.status}\nAmount: ${data.amount}\nCurrency: ${data.currency}`,
                },
            ],
        };
    } catch (error) {
        return createErrorResponse(`Unable to retrieve ${tx_id}`);
    }
}

export async function getTransactionTimeline({ tx_id }: { tx_id: string }) {
    try {
        const { status, data } = await transactionsClient.timeline(tx_id) || { status: null, data: null };

        if (!isValidResponse(status, data)) {
            return createErrorResponse(`Unable to retrieve timeline for ${tx_id}`);
        }

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Transaction Timeline: ${JSON.stringify(data)}`,
                },
            ],
        };
    } catch (error) {
        return createErrorResponse(`Unable to retrieve timeline for ${tx_id}`);
    }
}

export async function resendFailedWebhook({ tx_id }: { tx_id: string }) {
    try {
        const response = await transactionsClient.send_failed_webhook(tx_id);
        const { status, data } = response || { status: 200, data: { status: "successful" }};

        if (!data || !data.status || (typeof status === "number" && status >= 400)) {
            return createErrorResponse(`Unable to retrieve ${tx_id}`);
        }

        return {
            content: [
                {
                    type: "text" as const,
                    text: `webhook Sent`,
                },
            ],
        };
    } catch (error) {
        console.error(`Error fetching transaction ${tx_id}:`, error);
        return createErrorResponse(`Error retrieving ${tx_id}`);
    }
};

export async function registerTransactionTools() {
    server.tool(
        "read_transaction",
        "Get Transaction Details",
        TransactionSchema,
        async (args) => {
            return await getTransaction(args);
        }
    );

    server.tool(
        "read_transaction_timeline",
        "Get Transaction Timeline",
        TransactionSchema,
        async (args) => {
            return await getTransactionTimeline(args);
        }
    );

    server.tool(
        "resend_transaction_webhook",
        "Resend Failed Webhook",
        TransactionSchema,
        async (args) => {
            return await resendFailedWebhook(args);
        }
    ); 
}