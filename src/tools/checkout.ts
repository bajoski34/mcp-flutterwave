import Flutterwave from "../client/index.js";
import { CheckoutPayload } from "../types/index.js";
import { server } from "../server.js";
import { CheckoutPayloadSchema, DisableCheckoutSchema } from "../types/checkout/index.js";

// Cache checkout client to avoid repeated function calls
const checkoutClient = Flutterwave.checkout();

// Helper function to create error responses
function createErrorResponse(message: string) {
    return {
        content: [{ type: "text" as const, text: message }],
    };
}

// Helper function to validate API response
function isValidResponse(status: unknown, data: unknown): boolean {
    return !(typeof status === 'number' && status >= 400) && !!data;
}

export async function createCheckout(payload: CheckoutPayload) {
    try {
        const { status, data } = await checkoutClient.create(payload) || { status: null, data: null };

        if (!isValidResponse(status, data) || !data?.data?.status) {
            return createErrorResponse(
                data 
                    ? `Error occurred on creating checkout url for ${payload.customer.name} json: ${JSON.stringify(data)}`
                    : `Unable to create a checkout url for ${payload.customer.name}`
            );
        }

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Checkout link at: ${data.data?.link}`,
                },
            ],
        };
    } catch (error) {
        return createErrorResponse(`Error occurred on creating checkout url for ${payload.customer.name} json: ${JSON.stringify(error)}`);
    }
}

export async function disableCheckout(link: string) {
    try {
        const { status, data } = await checkoutClient.disable_link(link) || { status: null, data: null };

        if (!isValidResponse(status, data)) {
            return createErrorResponse(
                data 
                    ? `Unable to disable checkout link ${link} json: ${JSON.stringify(data)}`
                    : `Unable to disable checkout link ${link}`
            );
        }

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Successfully disabled the link.`,
                },
            ],
        };
    } catch (error) {
        return createErrorResponse(`Error occurred on disabling the checkout: ${link} json: ${JSON.stringify(error)}`);
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