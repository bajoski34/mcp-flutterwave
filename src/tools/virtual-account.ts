import Flutterwave from "../client/index.js";
import { server } from "../server.js";
import {
    CreateVirtualAccountSchema,
    GetVirtualAccountSchema,
    UpdateVirtualAccountSchema,
    ListVirtualAccountBulkSchema,
} from "../types/virtual-account/schema.js";
import { createVirtualAccountUI } from "../ui/index.js";

const vaClient = Flutterwave.virtualAccounts();

function createErrorResponse(message: string) {
    return { content: [{ type: "text" as const, text: message }] };
}

function buildVAResponse(response: any, tx_ref: string) {
    const d = response?.data;
    if (!d?.account_number) {
        return createErrorResponse(`Virtual account API returned an unexpected response: ${JSON.stringify(response)}`);
    }

    const ui = createVirtualAccountUI({
        tx_ref:         d.tx_ref ?? tx_ref,
        account_number: d.account_number,
        bank_name:      d.bank_name ?? 'N/A',
        currency:       d.currency ?? 'NGN',
        amount:         d.amount ? Number(d.amount) : undefined,
        email:          d.email ?? '',
        is_permanent:   d.is_permanent ?? false,
        order_ref:      d.order_ref,
        flw_ref:        d.flw_ref,
        note:           d.note,
        expiry_date:    d.expiry_date,
        account_status: d.account_status,
    });

    const typeLabel = d.is_permanent ? 'static' : 'dynamic';
    const expNote   = d.expiry_date ? ` Expires: ${d.expiry_date}.` : '';
    return {
        content: [
            {
                type: "text" as const,
                text: [
                    `Virtual account created (${typeLabel}).`,
                    `Account number: ${d.account_number} · Bank: ${d.bank_name}.`,
                    `order_ref: ${d.order_ref ?? 'N/A'}.${expNote}`,
                    `Share the account number and bank name with the customer. Use get_virtual_account with order_ref to check status.`,
                ].join('\n'),
            },
            { type: "resource" as const, resource: ui },
        ],
    };
}

export async function createVirtualAccount(payload: {
    email: string; currency: 'NGN' | 'GHS'; tx_ref: string;
    amount?: number; is_permanent?: boolean; bvn?: string;
    narration?: string; phonenumber?: string; firstname?: string; lastname?: string;
    frequency?: number; duration?: number;
}) {
    // NGN static accounts require BVN
    if (payload.currency === 'NGN' && payload.is_permanent && !payload.bvn) {
        return createErrorResponse(
            'BVN is required when creating a static (permanent) NGN virtual account. Please provide the bvn parameter.'
        );
    }

    try {
        const response = await vaClient.createVirtualAccount(payload as any);
        if (!response) return createErrorResponse(`Failed to create virtual account for ${payload.email}`);
        return buildVAResponse(response, payload.tx_ref);
    } catch (error) {
        return createErrorResponse(`Error creating virtual account: ${JSON.stringify(error)}`);
    }
}

export async function getVirtualAccount(order_ref: string) {
    try {
        const response = await vaClient.getVirtualAccount(order_ref);
        if (!response) return createErrorResponse(`Virtual account not found: ${order_ref}`);

        const d   = (response as any)?.data;
        const ui  = createVirtualAccountUI({
            tx_ref:         d?.tx_ref ?? order_ref,
            account_number: d?.account_number ?? 'N/A',
            bank_name:      d?.bank_name ?? 'N/A',
            currency:       d?.currency ?? 'NGN',
            amount:         d?.amount ? Number(d.amount) : undefined,
            email:          d?.email ?? '',
            is_permanent:   d?.is_permanent ?? false,
            order_ref,
            flw_ref:        d?.flw_ref,
            note:           d?.note,
            expiry_date:    d?.expiry_date,
            account_status: d?.account_status,
        });

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Virtual account: ${d?.account_number} · ${d?.bank_name} · Status: ${d?.account_status ?? 'unknown'}`,
                },
                { type: "resource" as const, resource: ui },
            ],
        };
    } catch (error) {
        return createErrorResponse(`Error fetching virtual account ${order_ref}: ${JSON.stringify(error)}`);
    }
}

export async function updateVirtualAccount(order_ref: string, bvn: string) {
    try {
        const response = await vaClient.updateVirtualAccount(order_ref, { bvn });
        if (!response) return createErrorResponse(`Failed to update virtual account ${order_ref}`);

        const d = (response as any)?.data;
        return {
            content: [
                {
                    type: "text" as const,
                    text: `Virtual account ${order_ref} updated. BVN linked successfully.`,
                },
            ],
        };
    } catch (error) {
        return createErrorResponse(`Error updating virtual account ${order_ref}: ${JSON.stringify(error)}`);
    }
}

export async function listVirtualAccountBulk(batch_id: string) {
    try {
        const response = await vaClient.listVirtualAccountBulk(batch_id);
        if (!response) return createErrorResponse(`No virtual accounts found for batch: ${batch_id}`);

        const accounts = (response as any)?.data ?? [];
        const count    = Array.isArray(accounts) ? accounts.length : 0;
        return {
            content: [
                {
                    type: "text" as const,
                    text: `Batch ${batch_id}: ${count} virtual account(s).\n${JSON.stringify(accounts, null, 2)}`,
                },
            ],
        };
    } catch (error) {
        return createErrorResponse(`Error listing virtual accounts for batch ${batch_id}: ${JSON.stringify(error)}`);
    }
}

export function registerVirtualAccountTools() {
    server.tool(
        "create_virtual_account",
        [
            "Create a virtual account number for a customer to make bank transfers into.",
            "Supports NGN (Nigeria) and GHS (Ghana).",
            "Two account types:",
            "  - Dynamic (default): one-time use, expires after ~1 hour; set amount to collect.",
            "  - Static (is_permanent: true): reusable wallet-funding account; amount is not required.",
            "NGN static accounts require a BVN (11-digit Bank Verification Number).",
            "GHS accounts support frequency (max uses) and duration (days active).",
            "Returns account_number, bank_name, and order_ref. Share account number and bank with the customer.",
        ].join(' '),
        CreateVirtualAccountSchema,
        async (args) => {
            try {
                return await createVirtualAccount(args);
            } catch (error) {
                return createErrorResponse(`Error creating virtual account for ${args.email}`);
            }
        }
    );

    server.tool(
        "get_virtual_account",
        "Retrieve a virtual account's details and current status using its order_ref.",
        GetVirtualAccountSchema,
        async (args) => {
            try {
                return await getVirtualAccount(args.order_ref);
            } catch (error) {
                return createErrorResponse(`Error fetching virtual account ${args.order_ref}`);
            }
        }
    );

    server.tool(
        "update_virtual_account",
        "Link or update the BVN (Bank Verification Number) on an existing NGN virtual account.",
        UpdateVirtualAccountSchema,
        async (args) => {
            try {
                return await updateVirtualAccount(args.order_ref, args.bvn);
            } catch (error) {
                return createErrorResponse(`Error updating virtual account ${args.order_ref}`);
            }
        }
    );

    server.tool(
        "list_virtual_account_bulk",
        "List all virtual accounts created in a bulk batch, identified by batch_id.",
        ListVirtualAccountBulkSchema,
        async (args) => {
            try {
                return await listVirtualAccountBulk(args.batch_id);
            } catch (error) {
                return createErrorResponse(`Error listing virtual accounts for batch ${args.batch_id}`);
            }
        }
    );
}
