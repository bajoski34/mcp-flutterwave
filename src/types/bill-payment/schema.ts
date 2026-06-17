import { z } from 'zod';

export const BILL_CATEGORIES = [
    'AIRTIME',
    'MOBILEDATA',
    'CABLEBILLS',
    'INTSERVICE',
    'UTILITYBILLS',
    'TAX',
    'DONATIONS',
    'TRANSLOG',
    'DEALPAY',
    'RELINST',
    'SCHPB',
] as const;

export const GetBillProvidersSchema = {
    category: z.enum(BILL_CATEGORIES, {
        errorMap: () => ({
            message: `Category must be one of: ${BILL_CATEGORIES.join(', ')}`,
        }),
    }),
};

export const GetBillItemsSchema = {
    biller_code: z.string().min(1, 'Biller code is required (e.g. BIL119)'),
};

export const ValidateBillCustomerSchema = {
    item_code: z.string().min(1, 'Item code is required (from get_bill_items)'),
    customer_id: z.string().min(1, 'Customer identifier is required (phone, meter, smartcard, etc.)'),
};

export const PayBillSchema = {
    biller_code: z.string().min(1, 'Biller code is required'),
    item_code: z.string().min(1, 'Item code is required'),
    customer_id: z.string().min(1, 'Customer identifier is required'),
    amount: z.number().positive('Amount must be positive'),
    country: z.literal('NG').default('NG'),
    reference: z.string().optional(),
    callback_url: z.string().url('Callback URL must be a valid URL').optional(),
};

export const GetBillStatusSchema = {
    reference: z.string().min(1, 'Reference (tx_ref from pay_bill) is required'),
};
