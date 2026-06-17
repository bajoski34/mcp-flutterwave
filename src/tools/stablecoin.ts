import Flutterwave from "../client/index.js";
import { server } from "../server.js";
import {
    GetStablecoinFeeSchema,
    SendStablecoinSchema,
    ConvertToStablecoinSchema,
} from "../types/stablecoin/schema.js";
import { createStablecoinFeeUI, createStablecoinTransferUI } from "../ui/index.js";

const transferClient = Flutterwave.transfers();

function createErrorResponse(message: string) {
    return { content: [{ type: "text" as const, text: message }] };
}

function buildTransferResponse(response: any, transferType: 'wallet' | 'convert') {
    const d = response?.data ?? response;
    if (!d?.reference && !d?.id) {
        return createErrorResponse(`Stablecoin transfer API returned an unexpected response: ${JSON.stringify(response)}`);
    }

    const ui = createStablecoinTransferUI({
        reference:     d.reference ?? String(d.id),
        amount:        Number(d.amount),
        currency:      d.currency,
        debit_currency: d.debit_currency,
        recipient:     d.account_number,
        transfer_type: transferType,
        status:        d.status ?? 'NEW',
        fee:           d.fee != null ? Number(d.fee) : undefined,
        created_at:    d.created_at,
    });

    return {
        content: [
            {
                type: "text" as const,
                text: [
                    `Stablecoin transfer initiated [${d.status ?? 'NEW'}].`,
                    `Reference: ${d.reference ?? d.id}`,
                    `Amount: ${d.currency} ${d.amount} · Debit: ${d.debit_currency}`,
                    transferType === 'wallet'
                        ? `Recipient wallet: ${d.account_number}`
                        : `Converted to ${d.currency} wallet.`,
                    `Use read_transaction_with_reference with reference "${d.reference}" to check settlement status.`,
                ].join('\n'),
            },
            { type: "resource" as const, resource: ui },
        ],
    };
}

export async function getStablecoinFee(params: {
    amount: number;
    currency: 'USDC' | 'USDT';
    debit_currency?: string;
}) {
    try {
        const response = await transferClient.getTransferFee({
            amount: params.amount,
            currency: params.currency,
            type: 'crypto',
            debit_currency: params.debit_currency,
        });

        if (!response) return createErrorResponse('Failed to fetch stablecoin transfer fee.');

        const feeList = (response as any)?.data ?? [];
        const feeItem = Array.isArray(feeList) ? feeList[0] : feeList;

        const ui = createStablecoinFeeUI({
            amount:           params.amount,
            currency:         params.currency,
            debit_currency:   params.debit_currency,
            fee:              feeItem?.fee ?? 0,
            fee_type:         feeItem?.fee_type ?? 'value',
            fee_in_fiat:      feeItem?.fee_amount_in_fiat_currency,
            fee_in_crypto:    feeItem?.fee_amount_in_crypto_currency,
            amount_minus_fee: feeItem?.amount_minus_fee,
        });

        const feeStr = feeItem?.fee_type === 'percentage'
            ? `${feeItem.fee}% of amount`
            : `${feeItem?.fee} ${params.currency} flat`;

        return {
            content: [
                {
                    type: "text" as const,
                    text: [
                        `Stablecoin transfer fee for ${params.amount} ${params.currency}:`,
                        `Fee: ${feeStr}`,
                        feeItem?.amount_minus_fee != null
                            ? `Recipient receives: ${feeItem.amount_minus_fee} ${params.currency}`
                            : '',
                    ].filter(Boolean).join('\n'),
                },
                { type: "resource" as const, resource: ui },
            ],
        };
    } catch (error) {
        return createErrorResponse(`Error fetching stablecoin fee: ${JSON.stringify(error)}`);
    }
}

export async function sendStablecoin(payload: {
    wallet_address: string;
    amount: number;
    currency: 'USDC' | 'USDT';
    debit_currency: 'USDC' | 'USDT';
    reference?: string;
    narration?: string;
}) {
    try {
        const response = await transferClient.create({
            account_bank:    'POLYGON',
            account_number:  payload.wallet_address,
            amount:          String(payload.amount),
            currency:        payload.currency,
            debit_currency:  payload.debit_currency,
            reference:       payload.reference,
            narration:       payload.narration,
        });

        if (!response) return createErrorResponse(`Failed to send ${payload.currency} to wallet ${payload.wallet_address}`);
        return buildTransferResponse(response, 'wallet');
    } catch (error) {
        return createErrorResponse(`Error sending stablecoin: ${JSON.stringify(error)}`);
    }
}

export async function convertToStablecoin(payload: {
    merchant_id: string;
    amount: number;
    currency: 'USDC' | 'USDT';
    debit_currency: 'NGN' | 'USD';
    reference?: string;
    narration?: string;
}) {
    try {
        const response = await transferClient.create({
            account_bank:   'flutterwave',
            account_number: payload.merchant_id,
            amount:         String(payload.amount),
            currency:       payload.currency,
            debit_currency: payload.debit_currency,
            reference:      payload.reference,
            narration:      payload.narration,
        });

        if (!response) return createErrorResponse(`Failed to convert ${payload.debit_currency} to ${payload.currency}`);
        return buildTransferResponse(response, 'convert');
    } catch (error) {
        return createErrorResponse(`Error converting to stablecoin: ${JSON.stringify(error)}`);
    }
}

export function registerStablecoinTools() {
    server.tool(
        "get_stablecoin_fee",
        [
            "Get the fee for a stablecoin transfer on the Polygon network before initiating it.",
            "For same-currency transfers (USDC → USDC or USDT → USDT), fee is a flat rate deducted from the amount.",
            "For cross-currency transfers (NGN → USDC), fee is a percentage deducted from the fiat balance.",
            "Always check the fee first so the user knows the actual amount the recipient will receive.",
        ].join(' '),
        GetStablecoinFeeSchema,
        async (args) => {
            try {
                return await getStablecoinFee(args as any);
            } catch (error) {
                return createErrorResponse('Error fetching stablecoin fee');
            }
        }
    );

    server.tool(
        "send_stablecoin",
        [
            "Send USDC or USDT to an external Polygon wallet address.",
            "Only Polygon network is supported — Tron, Solana, and Stellar will error.",
            "wallet_address must be a valid Polygon address (0x followed by 40 hex characters).",
            "debit_currency must match currency (both USDC or both USDT — you must hold the coin to send it).",
            "A fee is deducted from the transfer amount — call get_stablecoin_fee first to show the net amount.",
            "The Flutterwave account must be live, production-approved, and have the IP whitelisted.",
            "Use a unique reference per transfer. In test mode, append _PMCKDU to the reference.",
        ].join(' '),
        SendStablecoinSchema,
        async (args) => {
            try {
                return await sendStablecoin(args as any);
            } catch (error) {
                return createErrorResponse('Error sending stablecoin');
            }
        }
    );

    server.tool(
        "convert_to_stablecoin",
        [
            "Convert fiat (NGN or USD) from your Flutterwave wallet into USDC or USDT.",
            "merchant_id is your Flutterwave Merchant ID (account_number in the API).",
            "debit_currency must be NGN or USD — these are the only supported fiat sources.",
            "currency is the target stablecoin: USDC or USDT.",
            "A percentage fee is charged and deducted from the fiat balance, not the stablecoin amount.",
            "Call get_stablecoin_fee with debit_currency to see the fee before converting.",
            "After conversion, the stablecoin is available in your Flutterwave stablecoin wallet.",
        ].join(' '),
        ConvertToStablecoinSchema,
        async (args) => {
            try {
                return await convertToStablecoin(args as any);
            } catch (error) {
                return createErrorResponse('Error converting to stablecoin');
            }
        }
    );
}
