import Flutterwave from "../client/index.js";
import { CheckoutPayload } from "../types/index.js";
import { server } from "../server.js";
import { CreatePlanPayloadSchema, GetPlansFiltersSchema } from "../types/plan/schema.js";

// Cache plans client to avoid repeated function calls
const plansClient = Flutterwave.plans();

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

export async function createPlan(payload: { name: string; amount: number; interval: string; duration?: number; currency?: string; description?: string; }) {
    try {
        const { status, data } = await plansClient.create({
            ...payload,
            duration: payload.duration ?? 0, // Provide a default value if undefined
        }) || { status: null, data: null };
        
        if (!isValidResponse(status, data)) {
            return createErrorResponse(
                data 
                    ? `Unable to create plan ${payload.name} json: ${JSON.stringify(data)}`
                    : `Unable to create plan ${payload.name} json: {message: "No response from server"}`
            );
        }

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Plan created with ID: ${(data as { data?: { id?: string } }).data?.id}`,
                },
            ],
        };
    } catch (error) {
        return createErrorResponse(`Error Occured on creating plan ${payload.name} json: ${JSON.stringify(error)}`);
    }
}

export async function getPlans(filters?: { name?: string; amount?: number; interval?: string; status?: string; from?: string; to?: string; }) {
    try {
        const { status, data } = await plansClient.get({
            ...filters
        }) || { status: null, data: null };
        
        if (!isValidResponse(status, data) || !data?.status) {
            return createErrorResponse(
                data 
                    ? `Error Occured on retrieving plans json: ${JSON.stringify(data)}`
                    : `Unable to retrieve plans`
            );
        }

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Plans retrieved: ${JSON.stringify(data.data)}`,
                },
            ],
        };
    } catch (error) {
        return createErrorResponse(`Error Occured on retrieving plans json: ${JSON.stringify(error)}`);
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