import Flutterwave from "../client/index.js";
import { server } from "../server.js";
import { TransactionSchema } from "../types/transaction/schema.js";
import { createTransactionUI, createTimelineUI } from "../ui/index.js";

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

        // Create UI resource for rich visualization
        const uiResource = createTransactionUI({
            status: data.status || 'unknown',
            amount: (data as any).amount || 0,
            currency: (data as any).currency || 'NGN',
            tx_id: tx_id,
            customer: {
                name: (data as any).customer?.name,
                email: (data as any).customer?.email,
            },
            created_at: (data as any).created_at,
        });

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Transaction Status: ${data.status}\nAmount: ${(data as any).amount}\nCurrency: ${(data as any).currency}`,
                },
                {
                    type: "resource" as const,
                    resource: uiResource,
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

        // Create UI resource for timeline visualization
        const uiResource = createTimelineUI(tx_id, data);

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Transaction Timeline: ${JSON.stringify(data)}`,
                },
                {
                    type: "resource" as const,
                    resource: uiResource,
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