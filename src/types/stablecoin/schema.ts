import { z } from 'zod';

export const STABLECOINS = ['USDC', 'USDT'] as const;
export const FIAT_CURRENCIES = ['NGN', 'USD'] as const;
export const DEBIT_CURRENCIES = ['NGN', 'USD', 'USDC', 'USDT'] as const;

export const GetStablecoinFeeSchema = {
    amount: z.number().positive('Amount must be positive'),
    currency: z.enum(STABLECOINS, {
        errorMap: () => ({ message: 'currency must be USDC or USDT' }),
    }),
    debit_currency: z.enum(DEBIT_CURRENCIES, {
        errorMap: () => ({ message: 'debit_currency must be one of: NGN, USD, USDC, USDT' }),
    }).optional(),
};

export const SendStablecoinSchema = {
    wallet_address: z.string()
        .min(42, 'Polygon wallet address must be 42 characters (0x + 40 hex)')
        .max(42, 'Polygon wallet address must be 42 characters (0x + 40 hex)')
        .regex(/^0x[0-9a-fA-F]{40}$/, 'wallet_address must be a valid Polygon address (0x followed by 40 hex characters)'),
    amount: z.number().positive('Amount must be positive'),
    currency: z.enum(STABLECOINS, {
        errorMap: () => ({ message: 'currency must be USDC or USDT' }),
    }),
    debit_currency: z.enum(['USDC', 'USDT'] as const, {
        errorMap: () => ({ message: 'debit_currency must be USDC or USDT for wallet-to-wallet transfers' }),
    }),
    reference: z.string().optional(),
    narration: z.string().optional(),
};

export const ConvertToStablecoinSchema = {
    merchant_id: z.string().min(1, 'merchant_id (your Flutterwave Merchant ID) is required'),
    amount: z.number().positive('Amount must be positive'),
    currency: z.enum(STABLECOINS, {
        errorMap: () => ({ message: 'currency must be USDC or USDT' }),
    }),
    debit_currency: z.enum(FIAT_CURRENCIES, {
        errorMap: () => ({ message: 'debit_currency must be NGN or USD for fiat-to-stablecoin conversion' }),
    }),
    reference: z.string().optional(),
    narration: z.string().optional(),
};
