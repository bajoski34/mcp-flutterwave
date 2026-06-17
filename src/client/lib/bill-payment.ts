import { billPaymentClient as client } from "../http/index.js";
import type { paths } from "../types/v3/bill-payment.js";

type PayBillBody   = paths["/billers/{biller_code}/items/{item_code}/payment"]["post"]["requestBody"]["content"]["application/json"];
type CategoryResp  = paths["/top-bill-categories"]["get"]["responses"]["200"]["content"]["application/json"];
type ProvidersResp = paths["/bills/{category}/billers"]["get"]["responses"]["200"]["content"]["application/json"];
type ItemsResp     = paths["/billers/{biller_code}/items"]["get"]["responses"]["200"]["content"]["application/json"];
type ValidateResp  = paths["/bill-items/{item_code}/validate"]["get"]["responses"]["200"]["content"]["application/json"];
type PayResp       = paths["/billers/{biller_code}/items/{item_code}/payment"]["post"]["responses"]["200"]["content"]["application/json"];
type StatusResp    = paths["/bills/{reference}/status"]["get"]["responses"]["200"]["content"]["application/json"];

async function getBillCategories(): Promise<CategoryResp | undefined> {
    const { data, error } = await client.GET("/top-bill-categories", {
        params: { query: { country: "NG" } },
    });
    if (error) { console.error(error); return; }
    return data;
}

async function getBillProviders(category: string): Promise<ProvidersResp | undefined> {
    const { data, error } = await client.GET("/bills/{category}/billers", {
        params: { path: { category }, query: { country: "NG" } },
    });
    if (error) { console.error(error); return; }
    return data;
}

async function getBillItems(biller_code: string): Promise<ItemsResp | undefined> {
    const { data, error } = await client.GET("/billers/{biller_code}/items", {
        params: { path: { biller_code } },
    });
    if (error) { console.error(error); return; }
    return data;
}

async function validateBillCustomer(item_code: string, customer: string): Promise<ValidateResp | undefined> {
    const { data, error } = await client.GET("/bill-items/{item_code}/validate", {
        params: { path: { item_code }, query: { customer } },
    });
    if (error) { console.error(error); return; }
    return data;
}

async function payBill(
    biller_code: string,
    item_code: string,
    body: PayBillBody,
): Promise<PayResp | undefined> {
    const { data, error } = await client.POST("/billers/{biller_code}/items/{item_code}/payment", {
        params: { path: { biller_code, item_code } },
        body,
    });
    if (error) { console.error(error); return; }
    return data;
}

async function getBillStatus(reference: string): Promise<StatusResp | undefined> {
    const { data, error } = await client.GET("/bills/{reference}/status", {
        params: { path: { reference } },
    });
    if (error) { console.error(error); return; }
    return data;
}

export default {
    getBillCategories,
    getBillProviders,
    getBillItems,
    validateBillCustomer,
    payBill,
    getBillStatus,
};
