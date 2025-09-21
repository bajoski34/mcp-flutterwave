import { planClient as client } from "../http/index.js";
import type { paths } from "../types/v3/plans.js";

type CreatePlanPayload = (
  paths["/plans"]["post"]["requestBody"]
  & { content: { "application/json": unknown } }
)["content"]["application/json"];
type CreatePlanResponse = paths["/plans"]["post"]["responses"]["200"]["content"]["application/json"];

type GetPlanResponse = paths["/plans"]["get"]["responses"]["200"]["content"]["application/json"];
type GetPlanParams = paths["/plans"]["get"]["parameters"]["query"];

export default class Plan {
    async create(payload: CreatePlanPayload): Promise<{ status: number; data: CreatePlanResponse | null }> {
        try {
        const response = await client.POST("/plans", { body: payload });
        return { 
            status: response.response?.status ?? 500, 
            data: response.data ?? null 
        };
        } catch (error) {
        return { status: 500, data: null };
        }
    }

    async get(params?: GetPlanParams): Promise<{ status: number; data: GetPlanResponse | null }> {
        try {
        const response = await client.GET("/plans", { 
            query: params || {
                page: 1,
                status: "active",
                from: "",
                to: "",
                amount: 0,
                interval: ""
            }
        });
        return { 
            status: response.response?.status ?? 500, 
            data: response.data ?? null 
        };
        } catch (error) {
        return { status: 500, data: null };
        }
    }
}
