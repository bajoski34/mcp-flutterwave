import { fxTradeClient as client } from "../http/index.js";
import type { paths } from "../types/v3/fx-trade.js";

type RfqBody     = paths["/rfq"]["post"]["requestBody"]["content"]["application/json"];
type TradeBody   = paths["/trade"]["post"]["requestBody"]["content"]["application/json"];
type QuoteResp   = paths["/rfq"]["post"]["responses"]["200"]["content"]["application/json"];
type GetQuoteResp = paths["/rfq/{quote_id}"]["get"]["responses"]["200"]["content"]["application/json"];
type TradeResp   = paths["/trade"]["post"]["responses"]["200"]["content"]["application/json"];
type GetTradeResp = paths["/trade/{trade_id}"]["get"]["responses"]["200"]["content"]["application/json"];

async function requestFxQuote(body: RfqBody): Promise<QuoteResp | undefined> {
    const { data, error } = await client.POST("/rfq", { body });
    if (error) { console.error(error); return; }
    return data;
}

async function getFxQuote(quote_id: string): Promise<GetQuoteResp | undefined> {
    const { data, error } = await client.GET("/rfq/{quote_id}", {
        params: { path: { quote_id } },
    });
    if (error) { console.error(error); return; }
    return data;
}

async function initiateFxTrade(body: TradeBody): Promise<TradeResp | undefined> {
    const { data, error } = await client.POST("/trade", { body });
    if (error) { console.error(error); return; }
    return data;
}

async function getFxTrade(trade_id: string): Promise<GetTradeResp | undefined> {
    const { data, error } = await client.GET("/trade/{trade_id}", {
        params: { path: { trade_id } },
    });
    if (error) { console.error(error); return; }
    return data;
}

export default {
    requestFxQuote,
    getFxQuote,
    initiateFxTrade,
    getFxTrade,
};
