import { virtualAccountClient as client } from "../http/index.js";
import type { paths } from "../types/v3/virtual-account.js";

type CreatePayload  = paths["/virtual-account-numbers"]["post"]["requestBody"]["content"]["application/json"];
type VAResponse     = paths["/virtual-account-numbers"]["post"]["responses"]["200"]["content"]["application/json"];
type UpdatePayload  = paths["/virtual-account-numbers/{order_ref}"]["put"]["requestBody"]["content"]["application/json"];

async function createVirtualAccount(payload: CreatePayload): Promise<VAResponse | undefined> {
    const { data, error } = await client.POST("/virtual-account-numbers", {
        body: payload,
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

async function getVirtualAccount(order_ref: string): Promise<VAResponse | undefined> {
    const { data, error } = await client.GET("/virtual-account-numbers/{order_ref}", {
        params: { path: { order_ref } },
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

async function updateVirtualAccount(order_ref: string, payload: UpdatePayload): Promise<VAResponse | undefined> {
    const { data, error } = await client.PUT("/virtual-account-numbers/{order_ref}", {
        params: { path: { order_ref } },
        body: payload,
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

async function listVirtualAccountBulk(batch_id: string): Promise<unknown | undefined> {
    const { data, error } = await client.GET("/bulk-virtual-account-numbers", {
        params: { query: { batch_id } },
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

export default {
    createVirtualAccount,
    getVirtualAccount,
    updateVirtualAccount,
    listVirtualAccountBulk,
};
