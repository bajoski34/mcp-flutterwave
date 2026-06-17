import { z } from 'zod';

export const InitiateBvnSchema = {
    bvn: z.string()
        .length(11, 'BVN must be exactly 11 digits')
        .regex(/^\d{11}$/, 'BVN must contain only digits'),
    firstname: z.string().min(1, 'First name is required'),
    lastname: z.string().min(1, 'Last name is required'),
    redirect_url: z.string().url('redirect_url must be a valid URL'),
};

export const GetBvnDetailsSchema = {
    reference: z.string().min(1, 'reference returned from initiate_bvn_verification is required'),
};

export const ResolveBankAccountSchema = {
    account_number: z.string()
        .length(10, 'Account number must be exactly 10 digits')
        .regex(/^\d{10}$/, 'Account number must contain only digits'),
    account_bank: z.string().min(1, 'Bank code is required (e.g. "044" for Access Bank)'),
};

export const VerifyCardBinSchema = {
    bin: z.string()
        .min(6, 'BIN must be at least 6 digits')
        .max(8, 'BIN must be at most 8 digits')
        .regex(/^\d{6,8}$/, 'BIN must contain only digits'),
};
