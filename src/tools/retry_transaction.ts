import Flutterwave from "../client/index.js";

export default async ({ tx_id }: { tx_id: string }) => {
    if (!process.env.FLW_SECRET_KEY) {
        return {
            content: [{ type: "text", text: "API key is missing. Please check configuration." }],
        };
    }

    const transactions = Flutterwave.transactions();

    try {
        const response = await transactions.retry_transaction(tx_id);

        if (!response || response.status === 'error') {
            return {
                content: [{ 
                    type: "text", 
                    text: response?.message || `Unable to retry transaction ${tx_id}` 
                }],
            };
        }

        if (response.status === 'info' && response.data) {
            const data = response.data;
            return {
                content: [
                    {
                        type: "text",
                        text: `Transaction retry analysis completed for ${tx_id}:\n` +
                              `Status: ${data.status}\n` +
                              `Original Reference: ${data.original_tx_ref}\n` +
                              `Amount: ${data.amount} ${data.currency}\n` +
                              `Customer: ${data.customer_email}\n\n` +
                              `${response.message}`
                    },
                ],
            };
        }

        return {
            content: [
                {
                    type: "text",
                    text: `Transaction retry completed: ${response.message}`,
                },
            ],
        };
    } catch (error) {
        console.error(`Error retrying transaction ${tx_id}:`, error);
        return {
            content: [{ type: "text", text: `Error retrying transaction ${tx_id}` }],
        };
    }
};