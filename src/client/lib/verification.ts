import { verificationClient as client } from "../http/index.js";
import type { paths } from "../types/v3/verification.js";

type InitiateBvnBody  = paths["/bvn/verifications"]["post"]["requestBody"]["content"]["application/json"];
type InitiateBvnResp  = paths["/bvn/verifications"]["post"]["responses"]["200"]["content"]["application/json"];
type GetBvnResp       = paths["/bvn/verifications/{reference}"]["get"]["responses"]["200"]["content"]["application/json"];
type ResolveBankBody  = paths["/accounts/resolve"]["post"]["requestBody"]["content"]["application/json"];
type ResolveBankResp  = paths["/accounts/resolve"]["post"]["responses"]["200"]["content"]["application/json"];
type CardBinResp      = paths["/card-bins/{bin}"]["get"]["responses"]["200"]["content"]["application/json"];

async function initiateBvnVerification(body: InitiateBvnBody): Promise<InitiateBvnResp | undefined> {
    const { data, error } = await client.POST("/bvn/verifications", { body });
    if (error) { console.error(error); return; }
    return data;
}

async function getBvnDetails(reference: string): Promise<GetBvnResp | undefined> {
    const { data, error } = await client.GET("/bvn/verifications/{reference}", {
        params: { path: { reference } },
    });
    if (error) { console.error(error); return; }
    return data;
}

async function resolveBankAccount(body: ResolveBankBody): Promise<ResolveBankResp | undefined> {
    const { data, error } = await client.POST("/accounts/resolve", { body });
    if (error) { console.error(error); return; }
    return data;
}

async function verifyCardBin(bin: string): Promise<CardBinResp | undefined> {
    const { data, error } = await client.GET("/card-bins/{bin}", {
        params: { path: { bin } },
    });
    if (error) { console.error(error); return; }
    return data;
}

export default {
    initiateBvnVerification,
    getBvnDetails,
    resolveBankAccount,
    verifyCardBin,
};
