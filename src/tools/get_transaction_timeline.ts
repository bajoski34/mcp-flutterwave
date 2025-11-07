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
        const { status, data } = await transactionsClient.timeline(tx_id) || { status: null, data: null };

        if ((typeof status === 'number' && status >= 400) || !data || !(data as any)?.status) {
            return createErrorResponse(`Unable to retrieve timeline for ${tx_id}`);
        }

        // Format the timeline data for display
        let timelineText = `Transaction Timeline for ${tx_id}:\n\n`;
        
        if ((data as any).data && Array.isArray((data as any).data)) {
            (data as any).data.forEach((event: any, index: number) => {
                timelineText += `${index + 1}. ${event.event || 'Event'}: ${event.description || 'No description'}\n`;
                if (event.created_at) {
                    timelineText += `   Time: ${event.created_at}\n`;
                }
                timelineText += '\n';
            });
        } else {
            timelineText += 'No timeline events available for this transaction.';
        }

        return {
            content: [
                {
                    type: "text",
                    text: timelineText,
                },
            ],
        };
    } catch (error) {
        console.error(`Error fetching timeline for ${tx_id}:`, error);
        return createErrorResponse(`Error retrieving timeline for ${tx_id}`);
    }
};