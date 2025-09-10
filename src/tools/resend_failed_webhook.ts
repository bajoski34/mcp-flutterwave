import Flutterwave from "../client/index.js";

export default async ({ tx_id }: { tx_id: string }) => {
    if (!process.env.FLW_SECRET_KEY) {
        return {
            content: [{ type: "text", text: "API key is missing. Please check configuration." }],
        };
    }

    // Input validation
    if (!tx_id || tx_id.trim().length === 0) {
        return {
            content: [{ type: "text", text: "Transaction ID is required and cannot be empty." }],
        };
    }

    const transactions = Flutterwave.transactions();

    try {
        const response = await transactions.send_failed_webhook(tx_id.trim());
        const { status, data } = response || { status: 200, data: { status: "successful" }};

        if (!data || !data.status) {
            return {
                content: [{ type: "text", text: `Unable to resend webhook for transaction ${tx_id}. Please verify the transaction ID.` }],
            };
        }

        if (typeof status === "number" && status >= 400) {
            return {
                content: [{ type: "text", text: `Failed to resend webhook for transaction ${tx_id}. Server returned error ${status}.` }],
            };
        }

        return {
            content: [
                {
                    type: "text",
                    text: `Webhook successfully resent for transaction ${tx_id}.\nStatus: ${data.status}`,
                },
            ],
        };
    } catch (error) {
        console.error(`Error resending webhook for transaction ${tx_id}:`, error);
        return {
            content: [{ type: "text", text: `Error resending webhook for transaction ${tx_id}. Please try again later.` }],
        };
    }
};
