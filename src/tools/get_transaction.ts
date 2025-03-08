import Flutterwave from "../client/index.js";

export default async ({ tx_id }: { tx_id: string }) => {
    if (!process.env.FLW_SECRET_KEY) {
        return {
            content: [{ type: "text", text: "API key is missing. Please check configuration." }],
        };
    }

    const transactions = Flutterwave.transactions();

    try {
        const { status, data } = await transactions.get(tx_id) || { status: null, data: null };

        if(typeof status == 'number' && status >= 400)
            return {
                content: [{ type: "text", text: `Unable to retrive ${tx_id}` }],
            };
        
        if(!data)
            return {
                content: [{ type: "text", text: `Unable to retrive ${tx_id}` }],
            };

        if(!data.status)
            return {
                content: [{ type: "text", text: `Unable to retrive ${tx_id}` }],
            };

        return {
            content: [
                {
                    type: "text",
                    text: `Transaction Status: ${data.status}\nAmount: ${data.amount}\nCurrency: ${data.currency}`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: `Unable to retrive ${tx_id}` }],
        };
    }
}