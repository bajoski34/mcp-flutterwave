import Flutterwave from "../client/index.js";

export default async ({ tx_id }: { tx_id: string }) => {
    const transactions = Flutterwave.transactions();

    try {
        const response = await transactions.send_failed_webhook(tx_id);
        const { status, data } = response || { status: 200, data: { status: "successful" }};

        if (!data || !data.status) {
            return {
                content: [{ type: "text", text: `Unable to retrieve ${tx_id}` }],
            };
        }

        if (typeof status === "number" && status >= 400) {
            return {
                content: [{ type: "text", text: `Unable to retrieve ${tx_id}` }],
            };
        }

        return {
            content: [
                {
                    type: "text",
                    text: `webhook Sent`,
                },
            ],
        };
    } catch (error) {
        console.error(`Error fetching transaction ${tx_id}:`, error);
        return {
            content: [{ type: "text", text: `Error retrieving ${tx_id}` }],
        };
    }
};
