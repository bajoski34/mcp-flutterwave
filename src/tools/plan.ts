import Flutterwave from "../client/index.js";
import { CheckoutPayload } from "../types/index.js";
import { server } from "../server.js";
import { CreatePlanPayloadSchema, GetPlansFiltersSchema } from "../types/plan/schema.js";

export async function createPlan(payload: { name: string; amount: number; interval: string; duration?: number; currency?: string; description?: string; }) {
    const plans = Flutterwave.plans();
     
    try {
        const { status, data } = await plans.create({
            ...payload,
            duration: payload.duration ?? 0, // Provide a default value if undefined
        }) || { status: null, data: null };
        if(typeof status == 'number' && status >= 400)
            return {
                content: [{ type: "text" as const, text: `Unable to create plan ${ payload.name } json: ${ JSON.stringify(data) }` }],
            };
        
        if(!data)
            return {
                content: [{ type: "text" as const, text: `Unable to create plan ${ payload.name } json: {message: "No response from server"}` }],
            };

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Plan created with ID: ${ (data as { data?: { id?: string } }).data?.id }`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [{ type: "text" as const, text: `Error Occured on creating plan ${ payload.name } json: ${ JSON.stringify(error) }` }],
        };
    }
}

export async function getPlans(filters?: { name?: string; amount?: number; interval?: string; status?: string; from?: string; to?: string; }) {
    const plans = Flutterwave.plans();
    
    try {
        const { status, data } = await plans.get({
            ...filters
        }) || { status: null, data: null };
        if(typeof status == 'number' && status >= 400)
            return {
                content: [{ type: "text" as const, text: `Unable to retrieve plans` }],
            };
        
        if(!data)
            return {
                content: [{ type: "text" as const, text: `Unable to retrieve plans` }],
            };

        if(!data?.status)
            return {
                content: [{ type: "text" as const, text: `Error Occured on retrieving plans json: ${ JSON.stringify(data) }` }],
            };

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Plans retrieved: ${ JSON.stringify(data.data) }`,
                },
            ],
        };
    } catch (error) {
        return {
            content: [{ type: "text" as const, text: `Error Occured on retrieving plans json: ${ JSON.stringify(error) }` }],
        };
    }
}

export async function registerPlanTools() {
    server.tool(
        "create_payment_plan",
        "Create a payment plan with Flutterwave.",
        CreatePlanPayloadSchema,
        async (input) => await createPlan(input)
    )

    server.tool(
        "get_payment_plans",
        "Get payment plans with optional filters",
        GetPlansFiltersSchema,
        async (input) => await getPlans(input)
    )
}