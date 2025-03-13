import Flutterwave from "../client/index.js";
import { CheckoutPayload } from "../types.js";

export default async (payload: CheckoutPayload) => {
    const transactions = Flutterwave.checkout();

    try {
        const { status, data } = await transactions.create(payload) || { status: null, data: null };

        if(typeof status == 'number' && status >= 400)
            return {
                content: [{ type: "text", text: `Unable to create a checkout url for ${ payload.customer.name }` }],
            };
        
        if(!data)
            return {
                content: [{ type: "text", text: `Unable to create a checkout url for ${ payload.customer.name }` }],
            };

        if(!data?.data?.status)
            return {
                content: [{ type: "text", text: `Error Occured on creating checkout url for ${ payload.customer.name }` }],
            };

        return {
            content: [
                {
                    type: "text",
                    text: `Checkout link at: ${ data.data?.link }`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error Occured on creating checkout url for ${ payload.customer.name }` }],
        };
    }
}