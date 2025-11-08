import z from "zod";
import Flutterwave from "../client/index.js";
import { server } from "../server.js";
import { CreateTransferPayloadSchema, CreateBeneficiaryPayloadSchema } from "../types/transfer/schema.js";

// Cache transfer client to avoid repeated function calls
const transfersClient = Flutterwave.transfers();

// Helper function to create error responses
function createErrorResponse(message: string) {
    return {
        content: [{ type: "text" as const, text: message }],
    };
}

// Helper function to validate API response
function isValidResponse(status: unknown, data: unknown): data is { status?: string } {
    return !(typeof status === 'number' && status >= 400) && !!data;
}

export async function listBeneficiaries(): Promise<{ content: { type: "text"; text: string }[] }> {
    const response = await transfersClient.listBeneficiaries();

    if (!response) {
        return createErrorResponse("No response from transfer client");
    }

    if (!isValidResponse(response.status, response.data)) {
        return createErrorResponse("Failed to list beneficiaries");
    }

    return {
        content: [{ type: "text" as const, text: "Beneficiaries listed successfully" }],
    };
}

export async function createBeneficiary(payload: {
    account_bank: string,
    account_number: string,
    beneficiary_name: string,
    currency: string,
    bank_name: string
}) {
    const response = await transfersClient.createBeneficiary(payload);

    if (!response) {
        return createErrorResponse("No response from transfer client");
    }

    if (!isValidResponse(response.status, response.data)) {
        return createErrorResponse("Failed to create beneficiary");
    }

    return {
        content: [{ type: "text" as const, text: "Beneficiary created successfully" }],
    };
}

export async function createTransfer(payload: {
    account_bank: string,
    account_number: string,
    amount: number | string,
    currency: string,
    callback_url?: string,
    debit_subaccount?: string,
    beneficiary?: number,
    beneficiary_name?: string,
    reference?: string,
    debit_currency?: string,
    destination_branch_code?: string,
    narration?: string,
}) {

    // Ensure amount is a string as required by the Flutterwave API
    const requestPayload = {
        account_bank: payload.account_bank,
        account_number: payload.account_number,
        amount: String(payload.amount),
        currency: payload.currency,
        callback_url: payload.callback_url,
        debit_subaccount: payload.debit_subaccount,
        beneficiary: payload.beneficiary,
        beneficiary_name: payload.beneficiary_name,
        reference: payload.reference,
        debit_currency: payload.debit_currency,
        destination_branch_code: payload.destination_branch_code,
        narration: payload.narration,
    };

    const response = await transfersClient.create(requestPayload);

    if (!response) {
        return createErrorResponse("No response from transfer client");
    }

    if (!isValidResponse(response.status, response.data)) {
        return createErrorResponse("Failed to create transfer");
    }

    return {
        content: [{ type: "text" as const, text: "Transfer created successfully" }],
    };
}

export function registerTransferTools() {
    server.tool(
        "create_transfer",
        "Create a transfer with Flutterwave.",
        CreateTransferPayloadSchema,
        async (args) => {
            try {
                return await createTransfer(args);
            } catch (error) {
                return {
                    content: [{ type: "text" as const, text: `Error Occured on creating transfer` }],
                };
            }
        }
    );

    server.tool(
        "list_beneficiaries",
        "List all beneficiaries with Flutterwave.",
        async () => {
            try {
                return await listBeneficiaries();
            } catch (error) {
                return {
                    content: [{ type: "text" as const, text: `Error Occured on listing beneficiaries` }],
                };
            }
        }
    );

    server.tool(
        "create_beneficiary",
        "Create a new beneficiary with Flutterwave.",
        CreateBeneficiaryPayloadSchema,
        async (args) => {
            try {
                return await createBeneficiary(args);
            } catch (error) {
                return {
                    content: [{ type: "text" as const, text: `Error Occured on creating beneficiary` }],
                };
            }
        }
    );
}
