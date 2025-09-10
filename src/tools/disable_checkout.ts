import Flutterwave from "../client/index.js";

export default async ({ link }: { link: string }) => {
    // Input validation
    if (!link || link.trim().length === 0) {
        return {
            content: [{ type: "text", text: "Checkout link is required and cannot be empty." }],
        };
    }

    // Basic URL validation
    try {
        new URL(link.trim());
    } catch (error) {
        return {
            content: [{ type: "text", text: "Please provide a valid checkout URL." }],
        };
    }

    const transactions = Flutterwave.checkout();

    try {
        const { status, data } = await transactions.disable_link(link.trim()) || { status: null, data: null };

        if(typeof status == 'number' && status >= 400)
            return {
                content: [{ type: "text", text: `Unable to disable checkout link. Server returned error ${status}.` }],
            };
        
        if(!data)
            return {
                content: [{ type: "text", text: `Unable to disable checkout link. No response received from server.` }],
            };

        return {
            content: [
                {
                    type: "text",
                    text: `✅ Successfully disabled the checkout link.\n\nLink: ${link}\nStatus: ${(data as any)?.status || 'Disabled'}`,
                },
            ],
        };
    } catch (error) {
        console.error(`Error disabling checkout link:`, error);
        return {
            content: [{ type: "text", text: `Error occurred while disabling the checkout link. Please try again later.` }],
        };
    }
}