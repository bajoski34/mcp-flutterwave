import Flutterwave from "../client/index.js";

export default async (link: string) => {
    const transactions = Flutterwave.checkout();

    try {
        const { status, data } = await transactions.disable_link(link) || { status: null, data: null };

        if(typeof status == 'number' && status >= 400)
            return {
                content: [{ type: "text", text: `Unable to disable checkout link ${ link }` }],
            };
        
        if(!data)
            return {
                content: [{ type: "text", text: `Unable to disable checkout link ${ link }` }],
            };

        return {
            content: [
                {
                    type: "text",
                    text: `Successfully disabled the link.`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error Occured on diabling the checkout: ${ link }` }],
        };
    }
}