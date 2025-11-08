import { transferClient as client } from "../http/index.js";

type TransferPayload = {
    account_bank: string,
    account_number: string,
    amount: string,
    currency: string,
    callback_url?: string,
    debit_subaccount?: string,
    beneficiary?: number,
    beneficiary_name?: string,
    reference?: string,
    debit_currency?: string,
    destination_branch_code?: string,
    narration?: string,
}

type BulkInnerTransferPayload = {
    email: string,
    mobile_number: string,
    recipient_address: string,
    first_name?: string,
    last_name?: string
}

type BulkTransferPayload = {
    currency: string,
    bulk_data: BulkInnerTransferPayload[]
}

/**
 * Create a Transfer Beneficiary.
 * 
 * @param payload 
 * @returns 
 */
async function createBeneficiary(payload: {
    account_bank: string,
    account_number: string,
    beneficiary_name: string,
    currency: string,
    bank_name: string
}): Promise<{ data?: any; status?: string | number; message?: string } | undefined> {
    const { data, error } = await client.POST("/beneficiaries", {
        body: {
            ...payload
        }
    });

    if (error) {
        console.error(error);
        return error;
    }

    return data;
}

/**
 * List Beneficiaries.
 *
 * @returns
 * @param page
 */
async function listBeneficiaries(page: number = 1): Promise<{ data?: any; status?: string | number; meta?: { page_info?: { total_pages?: number } } } | undefined> {
    const { data, error } = await client.GET("/beneficiaries", {
        parameters: {
            query: {
                page
            }
        }
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

/**
 * Initiate a Transfer.
 * https://developer.flutterwave.com/v3.0.0/reference/create-a-transfer
 * 
*/
async function create(payload:TransferPayload): Promise<{ data: {
    data: any; link: string 
}, status: number } | undefined>{

    const { data, error } = await client.POST("/transfers", {
        body: {
            ...payload,
            amount: Number(payload.amount)
        }
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

/**
 * Retry a failed Transfer.
 * https://developer.flutterwave.com/v3.0.0/reference/transfer-retry
 * 
*/
async function retry(id: string): Promise<{ data?: {}, status?: string } | undefined> {
    const { data, error } = await client.POST("/transfers/{id}/retries", {
        params: {
            path: { id },
        },
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

/**
 * Get the current Status of a Transfer.
 * https://developer.flutterwave.com/v3.0.0/reference/get-a-transfer
 * 
*/
function get(id: string): Promise<string> {
    return Promise.resolve(id);
}

/**
 * Initiate a Bulk Transfer.
 * https://developer.flutterwave.com/v3.0.0/reference/create-bulk-transfer
 * 
*/
async function bulk(payload: BulkTransferPayload) {
    const { data, error } = await client.POST("/bulk-transfers", {
        body: {
            currency: payload.currency,
            bulk_data: payload.bulk_data.map(item => ({
                ...item
            }))
        }
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

export default {
    create,
    get,
    retry,
    bulk,
    createBeneficiary,
    listBeneficiaries
}