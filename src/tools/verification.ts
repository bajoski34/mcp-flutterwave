import Flutterwave from "../client/index.js";
import { server } from "../server.js";
import {
    InitiateBvnSchema,
    GetBvnDetailsSchema,
    ResolveBankAccountSchema,
    VerifyCardBinSchema,
} from "../types/verification/schema.js";
import {
    createBvnConsentUI,
    createBvnDetailsUI,
    createBankAccountUI,
    createCardBinUI,
} from "../ui/index.js";

const verifyClient = Flutterwave.verification();

function createErrorResponse(message: string) {
    return { content: [{ type: "text" as const, text: message }] };
}

export async function initiateBvnVerification(payload: {
    bvn: string;
    firstname: string;
    lastname: string;
    redirect_url: string;
}) {
    try {
        const response = await verifyClient.initiateBvnVerification(payload as any);
        if (!response) return createErrorResponse('Failed to initiate BVN verification.');

        const d         = (response as any)?.data;
        const reference = d?.reference ?? '';
        const url       = d?.url ?? null;

        const ui = createBvnConsentUI({
            reference,
            url,
            firstname:    payload.firstname,
            lastname:     payload.lastname,
            bvn_last4:   payload.bvn.slice(-4),
            redirect_url: payload.redirect_url,
        });

        const consentNote = url
            ? `Consent URL (single-use): ${url}\n\nShare this link with the customer. After they complete consent, call get_bvn_details with reference "${reference}".`
            : `Customer has already consented. Call get_bvn_details with reference "${reference}" to retrieve their BVN data.`;

        return {
            content: [
                {
                    type: "text" as const,
                    text: [
                        `BVN verification initiated for ${payload.firstname} ${payload.lastname}.`,
                        `Reference: ${reference}`,
                        consentNote,
                    ].join('\n'),
                },
                { type: "resource" as const, resource: ui },
            ],
        };
    } catch (error) {
        return createErrorResponse(`Error initiating BVN verification: ${JSON.stringify(error)}`);
    }
}

export async function getBvnDetails(reference: string) {
    try {
        const response = await verifyClient.getBvnDetails(reference);
        if (!response) return createErrorResponse(`BVN verification not found: ${reference}`);

        const d    = (response as any)?.data;
        const bvnd = d?.bvn_data;

        const ui = createBvnDetailsUI({
            reference,
            status:          d?.status ?? 'PENDING',
            first_name:      d?.first_name ?? bvnd?.firstName,
            last_name:       d?.last_name ?? bvnd?.surname,
            bvn:             bvnd?.bvn,
            dob:             bvnd?.dateOfBirth,
            gender:          bvnd?.gender,
            phone:           bvnd?.phoneNumber1,
            email:           bvnd?.email,
            nin:             bvnd?.nin,
            state_of_origin: bvnd?.stateOfOrigin,
            watchlisted:     bvnd?.watchlisted,
            created_at:      d?.created_at,
        });

        const isPending = d?.status !== 'COMPLETED';
        const summaryLines = [
            `BVN verification [${d?.status ?? 'PENDING'}] · Reference: ${reference}`,
        ];

        if (!isPending && bvnd) {
            summaryLines.push(`Name: ${bvnd.firstName ?? ''} ${bvnd.surname ?? ''}`.trim());
            if (bvnd.dateOfBirth) summaryLines.push(`DOB: ${bvnd.dateOfBirth}`);
            if (bvnd.gender)      summaryLines.push(`Gender: ${bvnd.gender}`);
            if (bvnd.watchlisted) summaryLines.push('⚠ Customer is watchlisted.');
        } else {
            summaryLines.push('Customer has not yet completed consent. Share the consent URL and poll again later.');
        }

        return {
            content: [
                { type: "text" as const, text: summaryLines.join('\n') },
                { type: "resource" as const, resource: ui },
            ],
        };
    } catch (error) {
        return createErrorResponse(`Error fetching BVN details for ${reference}: ${JSON.stringify(error)}`);
    }
}

export async function resolveBankAccount(account_number: string, account_bank: string) {
    try {
        const response = await verifyClient.resolveBankAccount({ account_number, account_bank });
        if (!response) return createErrorResponse(`Could not resolve account ${account_number} at bank ${account_bank}.`);

        const d    = (response as any)?.data;
        const name = d?.account_name ?? 'Unknown';
        const num  = d?.account_number ?? account_number;

        const ui = createBankAccountUI({
            account_number: num,
            account_name:   name,
            bank_code:      account_bank,
        });

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Account verified: ${name} · ${num} · Bank code: ${account_bank}`,
                },
                { type: "resource" as const, resource: ui },
            ],
        };
    } catch (error) {
        return createErrorResponse(`Error resolving account ${account_number}: ${JSON.stringify(error)}`);
    }
}

export async function verifyCardBin(bin: string) {
    try {
        const response = await verifyClient.verifyCardBin(bin);
        if (!response) return createErrorResponse(`No information found for card BIN: ${bin}`);

        const d = (response as any)?.data;

        const ui = createCardBinUI({
            bin:          d?.bin ?? bin,
            brand:        d?.brand,
            type:         d?.['card-type'],
            issuer:       d?.['issuer-info'],
            country:      d?.['iso-country-alpha2'],
            country_code: d?.['issuing-country'],
        });

        return {
            content: [
                {
                    type: "text" as const,
                    text: [
                        `Card BIN ${bin}: ${d?.brand ?? 'Unknown brand'} · ${d?.['card-type'] ?? 'Unknown type'}`,
                        `Issuer: ${d?.['issuer-info'] ?? 'N/A'} · Country: ${d?.['iso-country-alpha2'] ?? 'N/A'}`,
                    ].join('\n'),
                },
                { type: "resource" as const, resource: ui },
            ],
        };
    } catch (error) {
        return createErrorResponse(`Error verifying card BIN ${bin}: ${JSON.stringify(error)}`);
    }
}

export function registerVerificationTools() {
    server.tool(
        "initiate_bvn_verification",
        [
            "Begin a BVN (Bank Verification Number) identity verification for a Nigerian customer.",
            "Returns a single-use consent URL that the customer must visit to approve data sharing on the NIBSS portal.",
            "If the customer has already consented, url will be null — call get_bvn_details immediately.",
            "Save the returned reference — it is needed to retrieve the BVN data after consent is given.",
            "Requires account enablement by Flutterwave (contact hi@flutterwavego.com).",
            "BVN must be exactly 11 digits.",
        ].join(' '),
        InitiateBvnSchema,
        async (args) => {
            try {
                return await initiateBvnVerification(args as any);
            } catch (error) {
                return createErrorResponse(`Error initiating BVN verification`);
            }
        }
    );

    server.tool(
        "get_bvn_details",
        [
            "Retrieve full BVN identity data for a completed verification.",
            "Use the reference returned by initiate_bvn_verification.",
            "Returns name, date of birth, gender, phone, NIN, state of origin, and watchlist status.",
            "Status will be PENDING if the customer has not yet completed consent.",
            "Also triggered automatically via the bvn.completed webhook.",
        ].join(' '),
        GetBvnDetailsSchema,
        async (args) => {
            try {
                return await getBvnDetails(args.reference);
            } catch (error) {
                return createErrorResponse(`Error fetching BVN details for ${args.reference}`);
            }
        }
    );

    server.tool(
        "resolve_bank_account",
        [
            "Verify a bank account number and look up the account holder name.",
            "Use this before initiating a transfer to confirm the recipient's details.",
            "Requires account_number (10 digits) and account_bank (3-digit bank code).",
            "Common bank codes: 044 = Access Bank, 057 = Zenith Bank, 033 = United Bank for Africa, 058 = GTBank, 011 = First Bank.",
            "Returns the account name — always show this to the user before proceeding with a transfer.",
        ].join(' '),
        ResolveBankAccountSchema,
        async (args) => {
            try {
                return await resolveBankAccount(args.account_number, args.account_bank);
            } catch (error) {
                return createErrorResponse(`Error resolving account ${args.account_number}`);
            }
        }
    );

    server.tool(
        "verify_card_bin",
        [
            "Look up card metadata using the first 6–8 digits (BIN) of a card number.",
            "Returns the card brand (Visa, Mastercard, Verve, AMEX), type (debit/credit/prepaid), issuing bank, and country of issue.",
            "Use this to validate cards before charging or to display card info to the user.",
            "AMEX cards have a 6-digit BIN but require card_holder_name during charge_card.",
        ].join(' '),
        VerifyCardBinSchema,
        async (args) => {
            try {
                return await verifyCardBin(args.bin);
            } catch (error) {
                return createErrorResponse(`Error verifying card BIN ${args.bin}`);
            }
        }
    );
}
