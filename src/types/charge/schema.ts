import { z } from 'zod';

const MOBILE_MONEY_TYPES = [
    'mobile_money_ghana',
    'mobile_money_uganda',
    'mobile_money_rwanda',
    'mobile_money_zambia',
    'mobile_money_francophone',
] as const;

export const ChargeCardSchema = {
    tx_ref: z.string().min(1, 'Transaction reference is required'),
    amount: z.string().min(1, 'Amount is required'),
    currency: z.string().min(1, 'Currency is required'),
    email: z.string().email('Invalid email address'),
    card_number: z.string().min(12, 'Card number must be at least 12 digits'),
    cvv: z.string().min(3, 'CVV must be at least 3 digits'),
    expiry_month: z.string().min(1, 'Expiry month is required'),
    expiry_year: z.string().min(2, 'Expiry year is required'),
    fullname: z.string().optional(),
    phone_number: z.string().optional(),
    redirect_url: z.string().url('Redirect URL must be a valid URL').optional(),
    card_holder_name: z.string().optional(),
    authorization: z.object({
        mode: z.enum(['pin', 'avs_noauth'] as const, {
            errorMap: () => ({ message: 'Authorization mode must be "pin" or "avs_noauth"' }),
        }),
        pin: z.string().optional(),
        city: z.string().optional(),
        address: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        zipcode: z.string().optional(),
    }).optional(),
};

export const ChargeBankAccountSchema = {
    tx_ref: z.string().min(1, 'Transaction reference is required'),
    amount: z.string().min(1, 'Amount is required'),
    currency: z.string().min(1, 'Currency is required'),
    email: z.string().email('Invalid email address'),
    account_bank: z.string().min(1, 'Account bank code is required'),
    account_number: z.string().min(1, 'Account number is required'),
    fullname: z.string().optional(),
    phone_number: z.string().optional()
};

export const ChargeMobileMoneySchema = {
    type: z.enum(MOBILE_MONEY_TYPES, {
        errorMap: () => ({ message: `Type must be one of: ${MOBILE_MONEY_TYPES.join(', ')}` }),
    }),
    tx_ref: z.string().min(1, 'Transaction reference is required'),
    amount: z.string().min(1, 'Amount is required'),
    currency: z.string().min(1, 'Currency is required'),
    email: z.string().email('Invalid email address'),
    phone_number: z.string().min(1, 'Phone number is required for mobile money'),
    network: z.string().min(1, 'Network is required (e.g. MTN, VODAFONE, TIGO)').optional(),
    fullname: z.string().optional(),
};

export const ChargeMpesaSchema = {
    tx_ref: z.string().min(1, 'Transaction reference is required'),
    amount: z.string().min(1, 'Amount is required'),
    currency: z.literal('KES', { errorMap: () => ({ message: 'Currency must be KES for M-Pesa' }) }),
    email: z.string().email('Invalid email address'),
    phone_number: z.string().min(1, 'Phone number is required for M-Pesa'),
    fullname: z.string().optional(),
};

export const ChargeUssdSchema = {
    tx_ref: z.string().min(1, 'Transaction reference is required'),
    amount: z.string().min(1, 'Amount is required'),
    currency: z.literal('NGN', { errorMap: () => ({ message: 'Currency must be NGN for USSD' }) }),
    email: z.string().email('Invalid email address'),
    account_bank: z.string().min(1, 'Account bank code is required for USSD'),
    phone_number: z.string().min(1, 'Phone number is required for USSD'),
    fullname: z.string().optional(),
};

export const ValidateChargeSchema = {
    otp: z.string().min(4, 'OTP must be at least 4 characters'),
    flw_ref: z.string().min(1, 'Flutterwave reference is required'),
    type: z.string().optional(),
};
