import { z } from 'zod';

export const FX_CURRENCIES = ['NGN', 'GHS', 'USD'] as const;

export const RequestFxQuoteSchema = {
    base_currency: z.enum(FX_CURRENCIES, {
        errorMap: () => ({ message: 'base_currency must be one of: NGN, GHS, USD' }),
    }),
    target_currency: z.enum(FX_CURRENCIES, {
        errorMap: () => ({ message: 'target_currency must be one of: NGN, GHS, USD' }),
    }),
    quantity: z.number().positive('quantity must be a positive number (amount of base_currency to convert)'),
    reference: z.string().min(1).optional(),
    scenario: z.enum(['ready', 'expired', 'invalid_amount', 'invalid_currency_pair', 'exceeded_limit']).optional(),
};

export const GetFxQuoteSchema = {
    quote_id: z.string().min(1, 'quote_id is required (returned from request_fx_quote)'),
};

export const InitiateFxTradeSchema = {
    quote_id: z.string().min(1, 'quote_id of a READY quote is required'),
    narration: z.string().min(1, 'narration describing the purpose of the trade is required'),
};

export const GetFxTradeSchema = {
    trade_id: z.string().min(1, 'trade_id is required (returned from initiate_fx_trade)'),
};
