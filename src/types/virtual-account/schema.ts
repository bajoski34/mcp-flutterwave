import { z } from 'zod';

export const CreateVirtualAccountSchema = {
    email: z.string().email('Invalid email address'),
    currency: z.enum(['NGN', 'GHS'] as const, {
        errorMap: () => ({ message: 'Currency must be NGN or GHS' }),
    }),
    tx_ref: z.string().min(1, 'Transaction reference is required'),
    amount: z.number().positive('Amount must be a positive number').optional(),
    is_permanent: z.boolean().optional(),
    bvn: z.string().length(11, 'BVN must be exactly 11 digits').regex(/^\d{11}$/, 'BVN must be numeric').optional(),
    narration: z.string().optional(),
    phonenumber: z.string().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    frequency: z.number().int().positive('Frequency must be a positive integer').optional(),
    duration: z.number().int().positive('Duration must be a positive integer').optional(),
};

export const GetVirtualAccountSchema = {
    order_ref: z.string().min(1, 'Order reference is required'),
};

export const UpdateVirtualAccountSchema = {
    order_ref: z.string().min(1, 'Order reference is required'),
    bvn: z.string().length(11, 'BVN must be exactly 11 digits').regex(/^\d{11}$/, 'BVN must be numeric'),
};

export const ListVirtualAccountBulkSchema = {
    batch_id: z.string().min(1, 'Batch ID is required'),
};
