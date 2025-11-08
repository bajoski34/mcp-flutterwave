import { z } from 'zod';

export const CreateTransferPayloadSchema = {
    account_bank: z.string().min(1, "Account bank is required"),
    account_number: z.string().min(1, "Account number is required"),
    amount: z.number().positive("Amount must be a positive number"),
    currency: z.string().min(1, "Currency is required"),
    callback_url: z.string().url().optional(),
};

export const GetTransfersFiltersSchema = {
    id: z.string().min(1).optional(),
};

export const CreateBeneficiaryPayloadSchema = {
    account_bank: z.string().min(1, "Account bank is required"),
    account_number: z.string().min(1, "Account number is required"),
    beneficiary_name: z.string().min(1, "Beneficiary name is required"),
    currency: z.string().min(1, "Currency is required"),
    bank_name: z.string().min(1, "Bank name is required"),
};