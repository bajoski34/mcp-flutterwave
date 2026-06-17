import { encrypt } from "../../utils/encrypt.js";
import { chargeClient as client } from "../http/index.js";
import type { paths } from "../types/v3/charge.js";

type ChargeType = paths["/charges"]["post"]["parameters"]["query"]["type"];

type ChargePayload = paths["/charges"]["post"]["requestBody"]["content"]["application/json"];

type ChargeResponse = paths["/charges"]["post"]["responses"]["200"]["content"]["application/json"];

type ValidateChargePayload = paths["/validate-charge"]["post"]["requestBody"]["content"]["application/json"];


/**
 * Charge a card directly.
 * https://developer.flutterwave.com/v3.0.0/docs/direct-card-charge#encrypt-the-payload-request
 */
async function chargeCard(payload: ChargePayload): Promise<ChargeResponse | undefined> {
    const key = process.env.FLW_ENCRYPTION_KEY;
    if (!key) {
        console.error("FLW_ENCRYPTION_KEY is not set in the environment.");
        return;
    }

    // Encrypt card data before sending to Flutterwave.
    // redirect_url, phone_number, and authorization must all be inside the
    // ciphertext: redirect_url for 3DS flows, authorization for PIN/AVS second calls.
    const encryptedCardData = encrypt(key, JSON.stringify({
        encKey: key,
        tx_ref: payload.tx_ref,
        amount: payload.amount,
        currency: payload.currency,
        email: payload.email,
        fullname: payload.fullname,
        phone_number: payload.phone_number,
        redirect_url: payload.redirect_url,
        card_number: payload.card_number,
        cvv: payload.cvv,
        expiry_month: payload.expiry_month,
        expiry_year: payload.expiry_year,
        card_holder_name: payload.card_holder_name,
        ...(payload.authorization ? { authorization: payload.authorization } : {}),
    }));

    const { data, error } = await client.POST("/charges", {
        params: { query: { type: "card" } },
        body: {
            client: encryptedCardData,
        },
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

/**
 * Charge a bank account (NGN or GHS).
 * https://developer.flutterwave.com/v3.0.0/reference/charge-uk-bank-accounts
 */
async function chargeBankAccount(payload: ChargePayload): Promise<ChargeResponse | undefined> {
    const supportedCurrencies = ["NGN", "GHS", "GBP", "EUR"];
    const UKEURSupportedCurrencies = ["GBP", "EUR"];
    let type: ChargeType = 'mono';

    if (payload.currency && !supportedCurrencies.includes(payload.currency)) {
        console.error(`Currency ${payload.currency} is not supported for bank account charges. Supported currencies: ${supportedCurrencies.join(", ")}`);
        return;
    }

    if (payload.currency && UKEURSupportedCurrencies.includes(payload.currency)) {
        type = 'debit_uk_account';
    }

    const { data, error } = await client.POST("/charges", {
        params: { query: { type } },
        body: payload,
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

/**
 * Charge via mobile money (Ghana, Uganda, Rwanda, Zambia, Francophone Africa).
 * https://developer.flutterwave.com/reference/mobile-money-ghana
 */
async function chargeMobileMoney(type: ChargeType, payload: ChargePayload): Promise<ChargeResponse | undefined> {
    const { data, error } = await client.POST("/charges", {
        params: { query: { type } },
        body: payload,
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

/**
 * Charge via M-Pesa (KES).
 * https://developer.flutterwave.com/reference/mpesa
 */
async function chargeMpesa(payload: ChargePayload): Promise<ChargeResponse | undefined> {
    const { data, error } = await client.POST("/charges", {
        params: { query: { type: "mpesa" } },
        body: payload,
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

/**
 * Charge via USSD (NGN only).
 * https://developer.flutterwave.com/reference/ussd
 */
async function chargeUssd(payload: ChargePayload): Promise<ChargeResponse | undefined> {
    const { data, error } = await client.POST("/charges", {
        params: { query: { type: "ussd" } },
        body: payload,
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

/**
 * Charge via Fawry.
 * https://developer.flutterwave.com/v3.0.0/reference/charge-via-fawrypay
 */
async function chargeFawry(payload: ChargePayload): Promise<ChargeResponse | undefined> {
    const { data, error } = await client.POST("/charges", {
        params: { query: { type: "fawry_pay" } },
        body: payload,
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

/**
 * Charge via Capitec.
 * https://developer.flutterwave.com/v3.0.0/reference/charge-via-capitec
 */
async function chargeCapitec(payload: ChargePayload): Promise<ChargeResponse | undefined> {
    const { data, error } = await client.POST("/charges", {
        params: { query: { type: "capitec" } },
        body: payload,
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

/**
 * Validate a pending charge using an OTP.
 * https://developer.flutterwave.com/reference/validate-charge
 */
async function validateCharge(payload: ValidateChargePayload): Promise<ChargeResponse | undefined> {
    const { data, error } = await client.POST("/validate-charge", {
        body: payload,
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

export default {
    chargeCard,
    chargeBankAccount,
    chargeMobileMoney,
    chargeMpesa,
    chargeUssd,
    chargeFawry,
    validateCharge,
};
