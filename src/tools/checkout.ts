import Flutterwave from "../client/index.js";
import { CheckoutPayload } from "../types/index.js";
import { server } from "../server.js";
import { CheckoutPayloadSchema, DisableCheckoutSchema } from "../types/checkout/index.js";

export async function createCheckout(payload: CheckoutPayload) {
    const transactions = Flutterwave.checkout();

    try {
        const { status, data } = await transactions.create(payload) || { status: null, data: null };

        if(typeof status == 'number' && status >= 400)
            return {
                content: [{ type: "text" as const, text: `Unable to create a checkout url for ${ payload.customer.name }` }],
            };
        
        if(!data)
            return {
                content: [{ type: "text" as const, text: `Unable to create a checkout url for ${ payload.customer.name }` }],
            };

        if(!data?.data?.status)
            return {
                content: [{ type: "text" as const, text: `Error Occured on creating checkout url for ${ payload.customer.name } json: ${ JSON.stringify(data) }` }],
            };

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Checkout link at: ${ data.data?.link }`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [{ type: "text" as const, text: `Error Occured on creating checkout url for ${ payload.customer.name } json: ${ JSON.stringify(error) }` }],
        };
    }
}

export async function disableCheckout(link: string) {
    const transactions = Flutterwave.checkout();

    try {
        const { status, data } = await transactions.disable_link(link) || { status: null, data: null };

        if(typeof status == 'number' && status >= 400)
            return {
                content: [{ type: "text" as const, text: `Unable to disable checkout link ${ link } json: ${ JSON.stringify(data) }` }],
            };
        
        if(!data)
            return {
                content: [{ type: "text" as const, text: `Unable to disable checkout link ${ link }` }],
            };

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Successfully disabled the link.`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [{ type: "text" as const, text: `Error Occured on diabling the checkout: ${ link } json: ${ JSON.stringify(error) }` }],
        };
    }
}

export function registerCheckoutTools() {
    server.tool(
        "create_checkout",
        "Create a checkout link with Flutterwave.",
        CheckoutPayloadSchema,
        async (args) => {
            try {
                return await createCheckout(args);
            } catch (error) {
                return {
                    content: [{ type: "text" as const, text: `Error Occured on creating checkout url for ${ args.customer.name }` }],
                };
            }
        }
    );

    server.tool(
        "disable_checkout",
        "Disable a checkout link on Flutterwave.",
        DisableCheckoutSchema,
        async (args) => {
            return await disableCheckout(args.link);
        }
    );
}