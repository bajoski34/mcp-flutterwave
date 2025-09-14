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
        const { status, data } = await transactions.get(tx_id.trim()) || { status: null, data: null };

        if(typeof status == 'number' && status >= 400)
            return {
                content: [{ type: "text", text: `Unable to retrieve transaction ${tx_id}. Please check if the transaction ID is correct.` }],
            };
        
        if(!data)
            return {
                content: [{ type: "text", text: `Unable to retrieve transaction ${tx_id}. The transaction may not exist.` }],
            };

        if(!data.status)
            return {
                content: [{ type: "text", text: `Unable to retrieve transaction ${tx_id}. Invalid response format.` }],
            };

        // Enhanced transaction display with more details
        let transactionInfo = `Transaction Details for ${tx_id}:\n\n`;
        transactionInfo += `Status: ${data.status}\n`;
        transactionInfo += `Amount: ${data.amount || 'N/A'} ${data.currency || ''}\n`;
        
        if (data.tx_ref) {
            transactionInfo += `Reference: ${data.tx_ref}\n`;
        }
        
        if ((data as any).customer && (data as any).customer.email) {
            transactionInfo += `Customer: ${(data as any).customer.email}\n`;
        }
        
        if (data.created_at) {
            transactionInfo += `Date: ${data.created_at}\n`;
        }
        
        if ((data as any).processor_response) {
            transactionInfo += `Processor Response: ${(data as any).processor_response}\n`;
        }

        return {
            content: [
                {
                    type: "text",
                    text: transactionInfo,
                },
            ],
        };
    } catch (error) {
        console.error(`Error fetching transaction ${tx_id}:`, error);
        return {
            content: [{ type: "text", text: `Error retrieving transaction ${tx_id}. Please try again later.` }],
        };
    }
}