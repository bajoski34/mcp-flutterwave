import Flutterwave from "../client/index.js";
import { CheckoutPayload } from "../types.js";

export default async (payload: CheckoutPayload) => {
    // Input validation
    if (!payload) {
        return {
            content: [{ type: "text", text: "Payload is required for creating checkout." }],
        };
    }

    if (!payload.customer || !payload.customer.email || !payload.customer.name) {
        return {
            content: [{ type: "text", text: "Customer email and name are required for creating checkout." }],
        };
    }

    if (!payload.amount || parseFloat(payload.amount) <= 0) {
        return {
            content: [{ type: "text", text: "Valid amount is required for creating checkout." }],
        };
    }

    if (!payload.currency) {
        return {
            content: [{ type: "text", text: "Currency is required for creating checkout." }],
        };
    }

    const transactions = Flutterwave.checkout();

    try {
        const { status, data } = await transactions.create(payload) || { status: null, data: null };

        if(typeof status == 'number' && status >= 400)
            return {
                content: [{ type: "text", text: `Unable to create a checkout url for ${payload.customer.name}. Server returned error ${status}.` }],
            };
        
        if(!data)
            return {
                content: [{ type: "text", text: `Unable to create a checkout url for ${payload.customer.name}. No response data received.` }],
            };

        if(!data?.data?.status)
            return {
                content: [{ type: "text", text: `Error occurred while creating checkout url for ${payload.customer.name}. Invalid response format.` }],
            };

        return {
            content: [
                {
                    type: "text",
                    text: `✅ Checkout link created successfully for ${payload.customer.name}!\n\nPayment Link: ${data.data?.link}\nAmount: ${payload.amount} ${payload.currency}\nCustomer: ${payload.customer.email}`,
                },
            ],
        };
    } catch (error) {
        console.error(`Error creating checkout for ${payload.customer.name}:`, error);
        return {
            content: [{ type: "text", text: `Error occurred while creating checkout url for ${payload.customer.name}. Please try again later.` }],
        };
    }
}