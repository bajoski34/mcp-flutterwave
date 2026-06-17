import Flutterwave from "../client/index.js";
import { server } from "../server.js";
import {
    ChargeCardSchema,
    ChargeBankAccountSchema,
    ChargeMobileMoneySchema,
    ChargeMpesaSchema,
    ChargeUssdSchema,
    ValidateChargeSchema,
} from "../types/charge/schema.js";
import {
    createChargeUI,
    createPinAuthUI,
    createAvsAuthUI,
    create3dsRedirectUI,
    createOtpPromptUI,
} from "../ui/index.js";

const chargeClient = Flutterwave.charges();

function createErrorResponse(message: string) {
    return { content: [{ type: "text" as const, text: message }] };
}

function isValidResponse(status: unknown, data: unknown): boolean {
    return !(typeof status === 'number' && status >= 400) && !!data;
}

/**
 * Inspect the Flutterwave charge response and return the right UI + text
 * for each of the five card charge scenarios:
 *
 *   pin        – initial call, card needs PIN; no data yet
 *   avs_noauth – initial call, card needs billing address; no data yet
 *   redirect   – 3DS redirect (appears on first call OR after PIN/AVS)
 *   otp        – OTP sent after successful PIN/AVS; data present
 *   (none)     – charge completed (successful/failed) or no auth needed
 */
function buildChargeResponse(response: any, tx_ref: string, chargeType: string) {
    const meta       = response?.meta;
    const authMode   = meta?.authorization?.mode as string | undefined;
    const chargeData = response?.data;

    // ── Scenario 1: PIN required (first call, no data) ───────────────────────
    if (authMode === 'pin') {
        const ui = createPinAuthUI({ tx_ref, charge_type: chargeType });
        return {
            content: [
                {
                    type: "text" as const,
                    text: [
                        `PIN authorization required for ${tx_ref}. No charge has been made yet.`,
                        `Ask the customer for their 4-digit card PIN, then call charge_card again`,
                        `with the same parameters and add: authorization: { mode: "pin", pin: "<PIN>" }`,
                    ].join('\n'),
                },
                { type: "resource" as const, resource: ui },
            ],
        };
    }

    // ── Scenario 2: AVS required (first call, no data) ───────────────────────
    if (authMode === 'avs_noauth') {
        const fields: string[] = meta?.authorization?.fields ?? ['city', 'address', 'state', 'country', 'zipcode'];
        const ui = createAvsAuthUI({ tx_ref, charge_type: chargeType, fields });
        return {
            content: [
                {
                    type: "text" as const,
                    text: [
                        `Address Verification (AVS) required for ${tx_ref}. No charge has been made yet.`,
                        `Collect the following billing address fields from the customer: ${fields.join(', ')}.`,
                        `Then call charge_card again with the same parameters and add:`,
                        `authorization: { mode: "avs_noauth", ${fields.map(f => `${f}: "<value>"`).join(', ')} }`,
                    ].join('\n'),
                },
                { type: "resource" as const, resource: ui },
            ],
        };
    }

    // ── Scenario 3: 3DS redirect (first or second call) ──────────────────────
    if (authMode === 'redirect') {
        const redirectUrl = meta?.authorization?.redirect ?? '';
        const ui = create3dsRedirectUI({
            tx_ref:       chargeData?.tx_ref ?? tx_ref,
            charge_type:  chargeType,
            redirect_url: redirectUrl,
            flw_ref:      chargeData?.flw_ref,
            amount:       Number(chargeData?.amount ?? 0),
            currency:     chargeData?.currency ?? 'NGN',
        });
        return {
            content: [
                {
                    type: "text" as const,
                    text: [
                        `3D Secure authentication required.`,
                        `Redirect the customer to: ${redirectUrl}`,
                        `Transaction ID: ${chargeData?.id ?? 'N/A'} — store this to verify later.`,
                        `After the customer completes bank authentication they will be sent to redirect_url.`,
                        `Call read_transaction with that transaction ID to confirm the outcome.`,
                    ].join('\n'),
                },
                { type: "resource" as const, resource: ui },
            ],
        };
    }

    // ── Scenario 4: OTP required (second call after PIN/AVS) ─────────────────
    if (authMode === 'otp') {
        const flw_ref            = chargeData?.flw_ref ?? '';
        const processor_response = chargeData?.processor_response;
        const ui = createOtpPromptUI({
            tx_ref:              chargeData?.tx_ref ?? tx_ref,
            charge_type:         chargeType,
            flw_ref,
            processor_response,
            amount:              Number(chargeData?.amount ?? 0),
            currency:            chargeData?.currency ?? 'NGN',
            email:               chargeData?.customer?.email,
        });
        return {
            content: [
                {
                    type: "text" as const,
                    text: [
                        processor_response ? `Bank message: ${processor_response}` : `OTP validation required.`,
                        `flw_ref: ${flw_ref}`,
                        `Ask the customer for the OTP, then call validate_charge with:`,
                        `{ otp: "<OTP>", flw_ref: "${flw_ref}" }`,
                    ].join('\n'),
                },
                { type: "resource" as const, resource: ui },
            ],
        };
    }

    // ── Scenario 5: Completed (no auth needed / final status) ────────────────
    const status = chargeData?.status ?? 'unknown';
    const ui = createChargeUI({
        tx_ref:              chargeData?.tx_ref ?? tx_ref,
        status,
        amount:              Number(chargeData?.amount ?? 0),
        currency:            chargeData?.currency ?? 'NGN',
        charge_type:         chargeType,
        email:               chargeData?.customer?.email ?? '',
        fullname:            chargeData?.customer?.name,
        flw_ref:             chargeData?.flw_ref,
        processor_response:  chargeData?.processor_response,
    });
    const idNote = chargeData?.id ? ` Transaction ID: ${chargeData.id}.` : '';
    return {
        content: [
            { type: "text" as const, text: `Charge ${status}.${idNote}` },
            { type: "resource" as const, resource: ui },
        ],
    };
}

// ─── Tool handlers ────────────────────────────────────────────────────────────

type CardAuthorizationInput = {
    mode: 'pin' | 'avs_noauth';
    pin?: string;
    city?: string;
    address?: string;
    state?: string;
    country?: string;
    zipcode?: string;
};

export async function chargeCard(payload: {
    tx_ref: string; amount: string; currency: string; email: string;
    card_number: string; cvv: string; expiry_month: string; expiry_year: string;
    fullname?: string; phone_number?: string; redirect_url?: string;
    card_holder_name?: string;
    authorization?: CardAuthorizationInput;
}) {
    try {
        const response = await chargeClient.chargeCard({
            tx_ref:           payload.tx_ref,
            amount:           payload.amount,
            currency:         payload.currency,
            email:            payload.email,
            card_number:      payload.card_number,
            cvv:              payload.cvv,
            expiry_month:     payload.expiry_month,
            expiry_year:      payload.expiry_year,
            fullname:         payload.fullname,
            phone_number:     payload.phone_number,
            redirect_url:     payload.redirect_url,
            card_holder_name: payload.card_holder_name,
            authorization:    payload.authorization,
        } as any);

        if (!response || !isValidResponse(null, response)) {
            return createErrorResponse(`Unable to charge card for ${payload.email}`);
        }

        return buildChargeResponse(response, payload.tx_ref, 'card');
    } catch (error) {
        return createErrorResponse(`Error charging card for ${payload.email}: ${JSON.stringify(error)}`);
    }
}

export async function chargeBankAccount(payload: {
    tx_ref: string; amount: string; currency: string; email: string;
    account_bank: string; account_number: string; fullname?: string; phone_number?: string;
}) {
    try {
        const response = await chargeClient.chargeBankAccount({
            tx_ref:         payload.tx_ref,
            amount:         payload.amount,
            currency:       payload.currency,
            email:          payload.email,
            account_bank:   payload.account_bank,
            account_number: payload.account_number,
            fullname:       payload.fullname,
            phone_number:   payload.phone_number,
        });

        if (!response || !isValidResponse(null, response)) {
            return createErrorResponse(`Unable to charge bank account for ${payload.email}`);
        }

        return buildChargeResponse(response, payload.tx_ref, 'account');
    } catch (error) {
        return createErrorResponse(`Error charging bank account for ${payload.email}: ${JSON.stringify(error)}`);
    }
}

export async function chargeMobileMoney(payload: {
    type: 'mobile_money_ghana' | 'mobile_money_uganda' | 'mobile_money_rwanda' | 'mobile_money_zambia' | 'mobile_money_francophone';
    tx_ref: string; amount: string; currency: string; email: string;
    phone_number: string; network?: string; fullname?: string;
}) {
    try {
        const { type, ...rest } = payload;
        const response = await chargeClient.chargeMobileMoney(type, {
            tx_ref:       rest.tx_ref,
            amount:       rest.amount,
            currency:     rest.currency,
            email:        rest.email,
            phone_number: rest.phone_number,
            network:      rest.network,
            fullname:     rest.fullname,
        });

        if (!response || !isValidResponse(null, response)) {
            return createErrorResponse(`Unable to charge mobile money for ${payload.email}`);
        }

        return buildChargeResponse(response, payload.tx_ref, type);
    } catch (error) {
        return createErrorResponse(`Error charging mobile money for ${payload.email}: ${JSON.stringify(error)}`);
    }
}

export async function chargeMpesa(payload: {
    tx_ref: string; amount: string; currency: 'KES'; email: string;
    phone_number: string; fullname?: string;
}) {
    try {
        const response = await chargeClient.chargeMpesa({
            tx_ref:       payload.tx_ref,
            amount:       payload.amount,
            currency:     payload.currency,
            email:        payload.email,
            phone_number: payload.phone_number,
            fullname:     payload.fullname,
        });

        if (!response || !isValidResponse(null, response)) {
            return createErrorResponse(`Unable to charge M-Pesa for ${payload.email}`);
        }

        return buildChargeResponse(response, payload.tx_ref, 'mpesa');
    } catch (error) {
        return createErrorResponse(`Error charging M-Pesa for ${payload.email}: ${JSON.stringify(error)}`);
    }
}

export async function chargeUssd(payload: {
    tx_ref: string; amount: string; currency: 'NGN'; email: string;
    account_bank: string; phone_number: string; fullname?: string;
}) {
    try {
        const response = await chargeClient.chargeUssd({
            tx_ref:       payload.tx_ref,
            amount:       payload.amount,
            currency:     payload.currency,
            email:        payload.email,
            account_bank: payload.account_bank,
            phone_number: payload.phone_number,
            fullname:     payload.fullname,
        });

        if (!response || !isValidResponse(null, response)) {
            return createErrorResponse(`Unable to initiate USSD charge for ${payload.email}`);
        }

        return buildChargeResponse(response, payload.tx_ref, 'ussd');
    } catch (error) {
        return createErrorResponse(`Error initiating USSD charge for ${payload.email}: ${JSON.stringify(error)}`);
    }
}

export async function validateCharge(payload: { otp: string; flw_ref: string; type?: string }) {
    try {
        const response = await chargeClient.validateCharge({
            otp:     payload.otp,
            flw_ref: payload.flw_ref,
            type:    payload.type,
        });

        if (!response || !isValidResponse(null, response)) {
            return createErrorResponse(`Unable to validate charge with ref ${payload.flw_ref}`);
        }

        const chargeData = (response as any)?.data;
        const status     = chargeData?.status ?? 'unknown';

        const uiResource = createChargeUI({
            tx_ref:             chargeData?.tx_ref ?? payload.flw_ref,
            status,
            amount:             Number(chargeData?.amount ?? 0),
            currency:           chargeData?.currency ?? 'NGN',
            charge_type:        'validated',
            email:              chargeData?.customer?.email ?? '',
            fullname:           chargeData?.customer?.name,
            flw_ref:            payload.flw_ref,
            processor_response: chargeData?.processor_response,
        });

        const idNote = chargeData?.id ? ` Transaction ID: ${chargeData.id}.` : '';
        return {
            content: [
                { type: "text" as const, text: `Charge validated. Status: ${status}.${idNote}` },
                { type: "resource" as const, resource: uiResource },
            ],
        };
    } catch (error) {
        return createErrorResponse(`Error validating charge ${payload.flw_ref}: ${JSON.stringify(error)}`);
    }
}

// ─── Tool registration ────────────────────────────────────────────────────────

export function registerChargeTools() {
    server.tool(
        "charge_card",
        [
            "Directly charge a customer's debit or credit card with Flutterwave.",
            "This tool handles a multi-step flow:",
            "  1. First call: provide card details — returns required auth mode (pin/avs_noauth/redirect/none).",
            "  2. PIN flow: call again with authorization: { mode: 'pin', pin: '<PIN>' }.",
            "  3. AVS flow: call again with authorization: { mode: 'avs_noauth', city, address, state, country, zipcode }.",
            "  4. After PIN/AVS, if OTP is required: use validate_charge with the returned flw_ref.",
            "  5. If redirect: send customer to the 3DS URL, then use read_transaction to verify.",
            "  AMEX cards require card_holder_name.",
        ].join(' '),
        ChargeCardSchema,
        async (args) => {
            try {
                return await chargeCard(args);
            } catch (error) {
                return createErrorResponse(`Error occurred charging card for ${args.email}`);
            }
        }
    );

    server.tool(
        "charge_bank_account",
        "Directly debit a customer's bank account with Flutterwave (NGN or GHS).",
        ChargeBankAccountSchema,
        async (args) => {
            try {
                return await chargeBankAccount(args);
            } catch (error) {
                return createErrorResponse(`Error occurred charging bank account for ${args.email}`);
            }
        }
    );

    server.tool(
        "charge_mobile_money",
        "Charge a customer via mobile money with Flutterwave. Supports Ghana (GHS), Uganda (UGX), Rwanda (RWF), Zambia (ZMW), and Francophone Africa (XOF).",
        ChargeMobileMoneySchema,
        async (args) => {
            try {
                return await chargeMobileMoney(args);
            } catch (error) {
                return createErrorResponse(`Error occurred charging mobile money for ${args.email}`);
            }
        }
    );

    server.tool(
        "charge_mpesa",
        "Charge a customer via M-Pesa (KES) with Flutterwave.",
        ChargeMpesaSchema,
        async (args) => {
            try {
                return await chargeMpesa(args);
            } catch (error) {
                return createErrorResponse(`Error occurred charging M-Pesa for ${args.email}`);
            }
        }
    );

    server.tool(
        "charge_ussd",
        "Initiate a USSD charge for a customer in Nigeria (NGN) with Flutterwave.",
        ChargeUssdSchema,
        async (args) => {
            try {
                return await chargeUssd(args);
            } catch (error) {
                return createErrorResponse(`Error occurred initiating USSD charge for ${args.email}`);
            }
        }
    );

    server.tool(
        "validate_charge",
        "Validate a pending Flutterwave charge using the OTP sent to the customer. Call this after charge_card returns auth_mode 'otp'.",
        ValidateChargeSchema,
        async (args) => {
            try {
                return await validateCharge(args);
            } catch (error) {
                return createErrorResponse(`Error occurred validating charge ${args.flw_ref}`);
            }
        }
    );
}
