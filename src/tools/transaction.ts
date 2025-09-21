import Flutterwave from "../client/index.js";
import { server } from "../server.js";
import { TransactionSchema } from "../types/transaction/schema.js";

export async function getTransaction({ tx_id }: { tx_id: string }) {
    const transactions = Flutterwave.transactions();

    try {
        const { status, data } = await transactions.get(tx_id) || { status: null, data: null };

        if(typeof status == 'number' && status >= 400)
            return {
                content: [{ type: "text" as const, text: `Unable to retrive ${tx_id}` }],
            };
        
        if(!data)
            return {
                content: [{ type: "text" as const, text: `Unable to retrive ${tx_id}` }],
            };

        if(!data.status)
            return {
                content: [{ type: "text" as const, text: `Unable to retrive ${tx_id}` }],
            };

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Transaction Status: ${data.status}\nAmount: ${data.amount}\nCurrency: ${data.currency}`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [{ type: "text" as const, text: `Unable to retrive ${tx_id}` }],
        };
    }
}

export async function getTransactionTimeline({ tx_id }: { tx_id: string }) {
    const transactions = Flutterwave.transactions();

    try {
        const { status, data } = await transactions.timeline(tx_id) || { status: null, data: null };

        if(typeof status == 'number' && status >= 400)
            return {
                content: [{ type: "text" as const, text: `Unable to retrive timeline for ${tx_id}` }],
            };
        
        if(!data)
            return {
                content: [{ type: "text" as const, text: `Unable to retrive timeline for ${tx_id}` }],
            };

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Transaction Timeline: ${JSON.stringify(data)}`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [{ type: "text" as const, text: `Unable to retrive timeline for ${tx_id}` }],
        };
    }
}

export async function resendFailedWebhook({ tx_id }: { tx_id: string }) {
    const transactions = Flutterwave.transactions();

    try {
        const response = await transactions.send_failed_webhook(tx_id);
        const { status, data } = response || { status: 200, data: { status: "successful" }};

        if (!data || !data.status) {
            return {
                content: [{ type: "text" as const, text: `Unable to retrieve ${tx_id}` }],
            };
        }

        if (typeof status === "number" && status >= 400) {
            return {
                content: [{ type: "text" as const, text: `Unable to retrieve ${tx_id}` }],
            };
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
        return {
            content: [{ type: "text" as const, text: `Error retrieving ${tx_id}` }],
        };
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