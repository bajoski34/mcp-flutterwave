import Flutterwave from "../client/index.js";
import { server } from "../server.js";
import {
    GetBillProvidersSchema,
    GetBillItemsSchema,
    ValidateBillCustomerSchema,
    PayBillSchema,
    GetBillStatusSchema,
} from "../types/bill-payment/schema.js";
import { createBillPaymentUI, createBillStatusUI } from "../ui/index.js";

const billClient = Flutterwave.billPayments();

function createErrorResponse(message: string) {
    return { content: [{ type: "text" as const, text: message }] };
}

export async function getBillCategories() {
    try {
        const response = await billClient.getBillCategories();
        if (!response) return createErrorResponse('Failed to fetch bill categories.');

        const categories = (response as any)?.data ?? [];
        const list = Array.isArray(categories)
            ? categories.map((c: any) => `- ${c.name ?? c.id} (${c.biller_code ?? c.type ?? ''})`).join('\n')
            : JSON.stringify(categories, null, 2);

        return {
            content: [{
                type: "text" as const,
                text: `Available bill categories:\n${list}\n\nUse get_bill_providers with a category to see billers.`,
            }],
        };
    } catch (error) {
        return createErrorResponse(`Error fetching bill categories: ${JSON.stringify(error)}`);
    }
}

export async function getBillProviders(category: string) {
    try {
        const response = await billClient.getBillProviders(category);
        if (!response) return createErrorResponse(`No providers found for category: ${category}`);

        const billers = (response as any)?.data ?? [];
        const list = Array.isArray(billers)
            ? billers.map((b: any) => `- ${b.name} (biller_code: ${b.biller_code})`).join('\n')
            : JSON.stringify(billers, null, 2);

        return {
            content: [{
                type: "text" as const,
                text: `Billers for ${category}:\n${list}\n\nUse get_bill_items with a biller_code to see available items.`,
            }],
        };
    } catch (error) {
        return createErrorResponse(`Error fetching providers for ${category}: ${JSON.stringify(error)}`);
    }
}

export async function getBillItems(biller_code: string) {
    try {
        const response = await billClient.getBillItems(biller_code);
        if (!response) return createErrorResponse(`No items found for biller: ${biller_code}`);

        const items = (response as any)?.data ?? [];
        const list = Array.isArray(items)
            ? items.map((i: any) => `- ${i.name} (item_code: ${i.item_code}, amount: ${i.amount ?? 'variable'}, biller_code: ${i.biller_code ?? biller_code})`).join('\n')
            : JSON.stringify(items, null, 2);

        const aiртimeOrData = biller_code.startsWith('BIL0') || biller_code.startsWith('YELLO');
        const validateNote = aiртimeOrData
            ? 'No validation needed for airtime/data — call pay_bill directly.'
            : 'Use validate_bill_customer with item_code and customer_id before paying.';

        return {
            content: [{
                type: "text" as const,
                text: `Items for biller ${biller_code}:\n${list}\n\n${validateNote}`,
            }],
        };
    } catch (error) {
        return createErrorResponse(`Error fetching items for biller ${biller_code}: ${JSON.stringify(error)}`);
    }
}

export async function validateBillCustomer(item_code: string, customer_id: string) {
    try {
        const response = await billClient.validateBillCustomer(item_code, customer_id);
        if (!response) return createErrorResponse(`Validation failed for customer ${customer_id} on item ${item_code}`);

        const d = (response as any)?.data;
        const name    = d?.name ?? d?.customer ?? 'N/A';
        const address = d?.address ?? '';
        const amount  = d?.amount ?? d?.minimum_amount ?? '';

        return {
            content: [{
                type: "text" as const,
                text: [
                    `Customer validated for item ${item_code}.`,
                    `Name: ${name}${address ? ` · Address: ${address}` : ''}${amount ? ` · Amount: ${amount}` : ''}`,
                    `Customer ID: ${customer_id}`,
                    `Proceed with pay_bill using biller_code, item_code, and this customer_id.`,
                ].join('\n'),
            }],
        };
    } catch (error) {
        return createErrorResponse(`Error validating customer ${customer_id}: ${JSON.stringify(error)}`);
    }
}

export async function payBill(payload: {
    biller_code: string;
    item_code: string;
    customer_id: string;
    amount: number;
    country?: string;
    reference?: string;
    callback_url?: string;
}) {
    try {
        const body = {
            country:      payload.country ?? 'NG',
            customer:     payload.customer_id,
            amount:       payload.amount,
            recurrence:   'ONCE',
            type:         payload.item_code,
            reference:    payload.reference,
            callback_url: payload.callback_url,
        } as any;

        const response = await billClient.payBill(payload.biller_code, payload.item_code, body);
        if (!response) return createErrorResponse(`Bill payment failed for biller ${payload.biller_code}`);

        const d   = (response as any)?.data;
        const ref = d?.reference ?? d?.tx_ref ?? payload.reference ?? 'N/A';
        const ui  = createBillPaymentUI({
            reference:   ref,
            biller_code: payload.biller_code,
            item_code:   payload.item_code,
            customer_id: payload.customer_id,
            amount:      payload.amount,
            status:      d?.status ?? 'pending',
            network:     d?.network ?? undefined,
            token:       d?.token ?? d?.extra?.token ?? undefined,
        });

        return {
            content: [
                {
                    type: "text" as const,
                    text: [
                        `Bill payment submitted. Reference: ${ref}`,
                        `Use get_bill_status with reference "${ref}" to check completion and retrieve tokens (electricity).`,
                    ].join('\n'),
                },
                { type: "resource" as const, resource: ui },
            ],
        };
    } catch (error) {
        return createErrorResponse(`Error paying bill: ${JSON.stringify(error)}`);
    }
}

export async function getBillStatus(reference: string) {
    try {
        const response = await billClient.getBillStatus(reference);
        if (!response) return createErrorResponse(`No status found for reference: ${reference}`);

        const d     = (response as any)?.data;
        const extra = d?.extra ?? {};
        const token = extra?.token ?? extra?.prepaid_token ?? undefined;
        const ui    = createBillStatusUI({
            reference,
            amount:   d?.amount ?? 0,
            status:   d?.status ?? d?.payment_status ?? 'unknown',
            biller:   d?.network ?? d?.biller ?? '',
            customer: d?.customer ?? '',
            token,
            completed_at: d?.completed_date ?? d?.updated_at ?? '',
        });

        return {
            content: [
                {
                    type: "text" as const,
                    text: [
                        `Bill status: ${d?.status ?? 'unknown'} · Reference: ${reference}`,
                        token ? `Prepaid token: ${token}` : '',
                    ].filter(Boolean).join('\n'),
                },
                { type: "resource" as const, resource: ui },
            ],
        };
    } catch (error) {
        return createErrorResponse(`Error fetching bill status for ${reference}: ${JSON.stringify(error)}`);
    }
}

export function registerBillPaymentTools() {
    server.tool(
        "get_bill_categories",
        [
            "Fetch the top-level bill payment categories available in Nigeria.",
            "Categories include: AIRTIME, MOBILEDATA, CABLEBILLS, INTSERVICE, UTILITYBILLS, TAX, DONATIONS, and more.",
            "Use this as the first step to discover what bill types can be paid.",
            "Next step: call get_bill_providers with a category code.",
        ].join(' '),
        {},
        async () => {
            try {
                return await getBillCategories();
            } catch (error) {
                return createErrorResponse(`Error fetching bill categories`);
            }
        }
    );

    server.tool(
        "get_bill_providers",
        [
            "Fetch all billers/providers for a given bill category.",
            "Returns biller names and codes (biller_code) needed for subsequent steps.",
            "Example categories: AIRTIME, MOBILEDATA, CABLEBILLS (DSTV, GOTV), UTILITYBILLS (electricity).",
            "Next step: call get_bill_items with the biller_code.",
        ].join(' '),
        GetBillProvidersSchema,
        async (args) => {
            try {
                return await getBillProviders(args.category);
            } catch (error) {
                return createErrorResponse(`Error fetching providers for ${args.category}`);
            }
        }
    );

    server.tool(
        "get_bill_items",
        [
            "Fetch the payable items for a specific biller.",
            "Returns item codes, names, and amounts for each product the biller offers.",
            "For electricity billers: returns prepaid and postpaid items.",
            "For cable TV: returns subscription packages.",
            "Airtime and data billers typically skip validation — go straight to pay_bill.",
            "For all others: next step is validate_bill_customer with item_code and customer_id.",
        ].join(' '),
        GetBillItemsSchema,
        async (args) => {
            try {
                return await getBillItems(args.biller_code);
            } catch (error) {
                return createErrorResponse(`Error fetching items for biller ${args.biller_code}`);
            }
        }
    );

    server.tool(
        "validate_bill_customer",
        [
            "Validate a customer account before paying a bill.",
            "Required for most bill types EXCEPT airtime and mobile data.",
            "For electricity: customer_id is the meter number.",
            "For cable TV: customer_id is the smartcard/IUC number.",
            "For internet services: customer_id is the account ID.",
            "Returns the customer name and any preset amount.",
            "Next step: call pay_bill with the validated customer_id.",
        ].join(' '),
        ValidateBillCustomerSchema,
        async (args) => {
            try {
                return await validateBillCustomer(args.item_code, args.customer_id);
            } catch (error) {
                return createErrorResponse(`Error validating customer ${args.customer_id}`);
            }
        }
    );

    server.tool(
        "pay_bill",
        [
            "Pay a bill for a customer.",
            "Requires biller_code and item_code from get_bill_items.",
            "customer_id: phone number (airtime/data), meter number (electricity), smartcard number (cable TV).",
            "For electricity payments: the prepaid token is returned via get_bill_status (check the extra.token field).",
            "Returns a reference — use it with get_bill_status to track completion.",
            "Bill payments are for Nigeria (country: NG) only.",
        ].join(' '),
        PayBillSchema,
        async (args) => {
            try {
                return await payBill(args);
            } catch (error) {
                return createErrorResponse(`Error paying bill for customer ${args.customer_id}`);
            }
        }
    );

    server.tool(
        "get_bill_status",
        [
            "Check the status of a bill payment using its reference.",
            "Use the reference returned by pay_bill.",
            "For electricity payments: the prepaid token is in the extra.token field of the response.",
            "Always check status after pay_bill to confirm completion and retrieve tokens.",
        ].join(' '),
        GetBillStatusSchema,
        async (args) => {
            try {
                return await getBillStatus(args.reference);
            } catch (error) {
                return createErrorResponse(`Error fetching bill status for ${args.reference}`);
            }
        }
    );
}
