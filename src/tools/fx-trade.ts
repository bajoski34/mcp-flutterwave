import Flutterwave from "../client/index.js";
import { server } from "../server.js";
import {
    RequestFxQuoteSchema,
    GetFxQuoteSchema,
    InitiateFxTradeSchema,
    GetFxTradeSchema,
} from "../types/fx-trade/schema.js";
import { createFxQuoteUI, createFxTradeUI } from "../ui/index.js";

const fxClient = Flutterwave.fxTrades();

function createErrorResponse(message: string) {
    return { content: [{ type: "text" as const, text: message }] };
}

function buildQuoteResponse(response: any) {
    const d = response?.data;
    if (!d?.id) {
        return createErrorResponse(`FX quote API returned an unexpected response: ${JSON.stringify(response)}`);
    }

    const q = d.quote;
    const ui = createFxQuoteUI({
        quote_id:          d.id,
        reference:         d.reference ?? '',
        instrument:        d.instrument ?? '',
        quantity:          d.quantity ?? 0,
        status:            d.status ?? 'NEW',
        rate:              q?.best_available_rate,
        approved_quantity: q?.approved_quantity,
        total_value:       q?.total_value,
        expiry:            q?.expiry,
        complete_message:  d.complete_message,
        created_at:        d.created_at,
    });

    const statusText: Record<string, string> = {
        NEW:        'Quote is being processed. Poll get_fx_quote to check when it is READY.',
        READY:      `Quote is READY. Initiate a trade with initiate_fx_trade using quote_id "${d.id}" before it expires at ${q?.expiry ? new Date(q.expiry).toLocaleTimeString() : 'N/A'}.`,
        PROCESSING: 'Quote is in use — a trade has been initiated.',
        EXPIRED:    'Quote has expired (5-minute window passed). Submit a new request_fx_quote.',
        FAILED:     `Quote failed: ${d.complete_message ?? 'Check minimum amount and supported currency pair.'}`,
    };

    return {
        content: [
            {
                type: "text" as const,
                text: [
                    `FX Quote [${d.status}] · ${d.instrument} · ref: ${d.reference}`,
                    q ? `Rate: ${q.best_available_rate} · Approved: ${q.approved_quantity?.toLocaleString()} · Receive: ${q.total_value?.toLocaleString('en-US', { maximumFractionDigits: 4 })}` : '',
                    statusText[d.status] ?? '',
                ].filter(Boolean).join('\n'),
            },
            { type: "resource" as const, resource: ui },
        ],
    };
}

function buildTradeResponse(response: any) {
    const d = response?.data;
    if (!d?.id) {
        return createErrorResponse(`FX trade API returned an unexpected response: ${JSON.stringify(response)}`);
    }

    const ui = createFxTradeUI({
        trade_id:          d.id,
        reference:         d.reference ?? '',
        instrument:        d.instrument ?? '',
        quantity:          d.quantity ?? 0,
        approved_quantity: d.approved_quantity,
        price:             d.price ?? 0,
        status:            d.status ?? 'NEW',
        narration:         d.narration,
        recipient:         d.recipient,
        response_message:  d.response_message,
        created_at:        d.created_at,
    });

    const [, targetCcy] = (d.instrument ?? '/').split('/');
    const statusText: Record<string, string> = {
        NEW:     'Trade is queued. Call get_fx_trade to check status.',
        PENDING: 'Trade is being executed. Call get_fx_trade to check for settlement.',
        SETTLED: `Trade settled. ${d.price?.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${targetCcy} credited to your ${targetCcy} wallet.`,
        FAILED:  `Trade failed: ${d.response_message ?? 'Insufficient balance or processing error.'}`,
    };

    return {
        content: [
            {
                type: "text" as const,
                text: [
                    `FX Trade [${d.status}] · ${d.instrument} · ref: ${d.reference}`,
                    `You receive: ${d.price?.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${targetCcy}`,
                    statusText[d.status] ?? '',
                ].join('\n'),
            },
            { type: "resource" as const, resource: ui },
        ],
    };
}

export async function requestFxQuote(payload: {
    base_currency: 'NGN' | 'GHS' | 'USD';
    target_currency: 'NGN' | 'GHS' | 'USD';
    quantity: number;
    reference?: string;
    scenario?: string;
}) {
    if (payload.base_currency === payload.target_currency) {
        return createErrorResponse('base_currency and target_currency must be different currencies.');
    }

    try {
        const response = await fxClient.requestFxQuote(payload as any);
        if (!response) return createErrorResponse('Failed to submit FX quote request.');
        return buildQuoteResponse(response);
    } catch (error) {
        return createErrorResponse(`Error requesting FX quote: ${JSON.stringify(error)}`);
    }
}

export async function getFxQuote(quote_id: string) {
    try {
        const response = await fxClient.getFxQuote(quote_id);
        if (!response) return createErrorResponse(`FX quote not found: ${quote_id}`);
        return buildQuoteResponse(response);
    } catch (error) {
        return createErrorResponse(`Error fetching FX quote ${quote_id}: ${JSON.stringify(error)}`);
    }
}

export async function initiateFxTrade(quote_id: string, narration: string) {
    try {
        const response = await fxClient.initiateFxTrade({ quote_id, narration });
        if (!response) return createErrorResponse('Failed to initiate FX trade.');
        return buildTradeResponse(response);
    } catch (error) {
        return createErrorResponse(`Error initiating FX trade: ${JSON.stringify(error)}`);
    }
}

export async function getFxTrade(trade_id: string) {
    try {
        const response = await fxClient.getFxTrade(trade_id);
        if (!response) return createErrorResponse(`FX trade not found: ${trade_id}`);
        return buildTradeResponse(response);
    } catch (error) {
        return createErrorResponse(`Error fetching FX trade ${trade_id}: ${JSON.stringify(error)}`);
    }
}

export function registerFxTradeTools() {
    server.tool(
        "request_fx_quote",
        [
            "Submit a Request For Quote (RFQ) to convert currency.",
            "Supported pairs: NGN/USD, GHS/USD, USD/NGN.",
            "Minimum trade is $1,000 USD equivalent.",
            "FX trading is available on weekdays (Monday–Friday) only.",
            "The quote is processed asynchronously — it starts as NEW.",
            "Call get_fx_quote with the returned quote_id to check when it is READY.",
            "Once READY, you have 5 minutes to execute the trade with initiate_fx_trade.",
            "Use a unique reference per quote; duplicate references will error.",
        ].join(' '),
        RequestFxQuoteSchema,
        async (args) => {
            try {
                return await requestFxQuote(args as any);
            } catch (error) {
                return createErrorResponse(`Error requesting FX quote`);
            }
        }
    );

    server.tool(
        "get_fx_quote",
        [
            "Check the status and pricing of an FX quote (RFQ).",
            "Poll this after request_fx_quote until status is READY or FAILED.",
            "When READY: the quote contains the exchange rate, approved quantity, total value, and expiry time.",
            "Quote statuses: NEW (processing) → READY (execute now) | EXPIRED (timed out) | FAILED (invalid pair/amount).",
            "A READY quote expires 5 minutes from issuance — call initiate_fx_trade promptly.",
        ].join(' '),
        GetFxQuoteSchema,
        async (args) => {
            try {
                return await getFxQuote(args.quote_id);
            } catch (error) {
                return createErrorResponse(`Error fetching FX quote ${args.quote_id}`);
            }
        }
    );

    server.tool(
        "initiate_fx_trade",
        [
            "Execute an FX trade using a READY quote.",
            "Locks in the exchange rate and debits the base currency from your wallet.",
            "The quote must be in READY status and not yet expired.",
            "Each quote can only be used once.",
            "Returns a trade_id — call get_fx_trade to monitor settlement.",
            "Upon settlement (status: SETTLED), converted funds land instantly in your target currency wallet.",
        ].join(' '),
        InitiateFxTradeSchema,
        async (args) => {
            try {
                return await initiateFxTrade(args.quote_id, args.narration);
            } catch (error) {
                return createErrorResponse(`Error initiating FX trade`);
            }
        }
    );

    server.tool(
        "get_fx_trade",
        [
            "Check the status of an FX trade.",
            "Poll this after initiate_fx_trade until status is SETTLED or FAILED.",
            "Trade statuses: NEW → PENDING (executing) → SETTLED (funds exchanged) | FAILED.",
            "On SETTLED: the converted amount (price field) has been credited to the target currency wallet.",
            "On FAILED: check response_message for the reason (e.g. insufficient balance).",
        ].join(' '),
        GetFxTradeSchema,
        async (args) => {
            try {
                return await getFxTrade(args.trade_id);
            } catch (error) {
                return createErrorResponse(`Error fetching FX trade ${args.trade_id}`);
            }
        }
    );
}
