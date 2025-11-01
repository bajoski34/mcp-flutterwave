import Flutterwave from "../client/index.js";

// Cache transactions client to avoid repeated function calls
const transactionsClient = Flutterwave.transactions();

// Helper function to create error responses
function createErrorResponse(message: string) {
    return {
        content: [{ type: "text", text: message }],
    };
}

export default async ({ tx_id }: { tx_id: string }) => {
    if (!process.env.FLW_SECRET_KEY) {
        return createErrorResponse("API key is missing. Please check configuration.");
    }

    try {
        const response = await transactionsClient.retry_transaction(tx_id);

        if (!response || response.status === 'error') {
            return createErrorResponse(response?.message || `Unable to retry transaction ${tx_id}`);
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
        return createErrorResponse(`Error retrying transaction ${tx_id}`);
    }
};