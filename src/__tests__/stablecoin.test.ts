import { describe, it, expect } from 'vitest';
import {
    GetStablecoinFeeSchema,
    SendStablecoinSchema,
    ConvertToStablecoinSchema,
    STABLECOINS,
    FIAT_CURRENCIES,
} from '../types/stablecoin/schema.js';
import { createStablecoinFeeUI, createStablecoinTransferUI } from '../ui/index.js';

// ─── Schema tests ─────────────────────────────────────────────────────────────

describe('GetStablecoinFeeSchema', () => {
    it('accepts USDC and USDT', () => {
        for (const coin of STABLECOINS) {
            expect(GetStablecoinFeeSchema.currency.safeParse(coin).success).toBe(true);
        }
    });

    it('rejects unsupported coin', () => {
        expect(GetStablecoinFeeSchema.currency.safeParse('BTC').success).toBe(false);
        expect(GetStablecoinFeeSchema.currency.safeParse('ETH').success).toBe(false);
        expect(GetStablecoinFeeSchema.currency.safeParse('NGN').success).toBe(false);
    });

    it('accepts positive amount', () => {
        expect(GetStablecoinFeeSchema.amount.safeParse(50).success).toBe(true);
        expect(GetStablecoinFeeSchema.amount.safeParse(0.01).success).toBe(true);
    });

    it('rejects zero or negative amount', () => {
        expect(GetStablecoinFeeSchema.amount.safeParse(0).success).toBe(false);
        expect(GetStablecoinFeeSchema.amount.safeParse(-10).success).toBe(false);
    });

    it('accepts all debit_currency values including undefined', () => {
        expect(GetStablecoinFeeSchema.debit_currency.safeParse('NGN').success).toBe(true);
        expect(GetStablecoinFeeSchema.debit_currency.safeParse('USD').success).toBe(true);
        expect(GetStablecoinFeeSchema.debit_currency.safeParse('USDC').success).toBe(true);
        expect(GetStablecoinFeeSchema.debit_currency.safeParse('USDT').success).toBe(true);
        expect(GetStablecoinFeeSchema.debit_currency.safeParse(undefined).success).toBe(true);
    });

    it('rejects invalid debit_currency', () => {
        expect(GetStablecoinFeeSchema.debit_currency.safeParse('GHS').success).toBe(false);
        expect(GetStablecoinFeeSchema.debit_currency.safeParse('EUR').success).toBe(false);
    });
});

describe('SendStablecoinSchema', () => {
    // Valid Polygon address: 0x + exactly 40 hex chars = 42 chars total
    const validAddr = '0xAbC1234567890dEf1234567890aBcDeF12345678';

    it('accepts valid Polygon wallet address', () => {
        expect(SendStablecoinSchema.wallet_address.safeParse(validAddr).success).toBe(true);
    });

    it('rejects address not starting with 0x', () => {
        expect(SendStablecoinSchema.wallet_address.safeParse('AbC1234567890dEf1234567890aBcDeF123456789a').success).toBe(false);
    });

    it('rejects address wrong length', () => {
        expect(SendStablecoinSchema.wallet_address.safeParse('0xAbC1234').success).toBe(false);
        expect(SendStablecoinSchema.wallet_address.safeParse('0xAbC1234567890dEf1234567890aBcDeF1234567890').success).toBe(false);
    });

    it('rejects non-hex characters in address', () => {
        expect(SendStablecoinSchema.wallet_address.safeParse('0xZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ').success).toBe(false);
    });

    it('accepts USDC and USDT currency', () => {
        expect(SendStablecoinSchema.currency.safeParse('USDC').success).toBe(true);
        expect(SendStablecoinSchema.currency.safeParse('USDT').success).toBe(true);
    });

    it('rejects fiat as currency', () => {
        expect(SendStablecoinSchema.currency.safeParse('NGN').success).toBe(false);
        expect(SendStablecoinSchema.currency.safeParse('USD').success).toBe(false);
    });

    it('rejects fiat as debit_currency for wallet transfer', () => {
        expect(SendStablecoinSchema.debit_currency.safeParse('NGN').success).toBe(false);
        expect(SendStablecoinSchema.debit_currency.safeParse('USD').success).toBe(false);
    });

    it('accepts USDC and USDT as debit_currency', () => {
        expect(SendStablecoinSchema.debit_currency.safeParse('USDC').success).toBe(true);
        expect(SendStablecoinSchema.debit_currency.safeParse('USDT').success).toBe(true);
    });

    it('accepts positive amount', () => {
        expect(SendStablecoinSchema.amount.safeParse(50).success).toBe(true);
    });

    it('rejects zero or negative amount', () => {
        expect(SendStablecoinSchema.amount.safeParse(0).success).toBe(false);
        expect(SendStablecoinSchema.amount.safeParse(-1).success).toBe(false);
    });

    it('accepts optional reference and narration', () => {
        expect(SendStablecoinSchema.reference.safeParse(undefined).success).toBe(true);
        expect(SendStablecoinSchema.reference.safeParse('CRYPTO-001').success).toBe(true);
        expect(SendStablecoinSchema.narration.safeParse(undefined).success).toBe(true);
    });
});

describe('ConvertToStablecoinSchema', () => {
    it('accepts valid merchant_id', () => {
        expect(ConvertToStablecoinSchema.merchant_id.safeParse('300408963').success).toBe(true);
    });

    it('rejects empty merchant_id', () => {
        expect(ConvertToStablecoinSchema.merchant_id.safeParse('').success).toBe(false);
    });

    it('accepts NGN and USD as debit_currency', () => {
        for (const fiat of FIAT_CURRENCIES) {
            expect(ConvertToStablecoinSchema.debit_currency.safeParse(fiat).success).toBe(true);
        }
    });

    it('rejects stablecoin as debit_currency for fiat conversion', () => {
        expect(ConvertToStablecoinSchema.debit_currency.safeParse('USDC').success).toBe(false);
        expect(ConvertToStablecoinSchema.debit_currency.safeParse('USDT').success).toBe(false);
    });

    it('rejects other fiat currencies', () => {
        expect(ConvertToStablecoinSchema.debit_currency.safeParse('GHS').success).toBe(false);
        expect(ConvertToStablecoinSchema.debit_currency.safeParse('KES').success).toBe(false);
    });

    it('accepts USDC and USDT as target currency', () => {
        expect(ConvertToStablecoinSchema.currency.safeParse('USDC').success).toBe(true);
        expect(ConvertToStablecoinSchema.currency.safeParse('USDT').success).toBe(true);
    });

    it('accepts positive amount', () => {
        expect(ConvertToStablecoinSchema.amount.safeParse(1500000).success).toBe(true);
    });

    it('accepts optional reference and narration', () => {
        expect(ConvertToStablecoinSchema.reference.safeParse(undefined).success).toBe(true);
        expect(ConvertToStablecoinSchema.narration.safeParse(undefined).success).toBe(true);
    });
});

// ─── UI tests ─────────────────────────────────────────────────────────────────

describe('createStablecoinFeeUI', () => {
    const baseFee = {
        amount: 50,
        currency: 'USDT',
        fee: 1.5,
        fee_type: 'value',
        amount_minus_fee: 48.5,
    };

    it('returns a UI resource', () => {
        const resource = createStablecoinFeeUI(baseFee);
        expect(resource).toBeDefined();
        expect(resource.uri).toContain('ui://stablecoin-fee/');
    });

    it('includes currency pair in output', () => {
        const str = JSON.stringify(createStablecoinFeeUI(baseFee));
        expect(str).toContain('USDT');
    });

    it('shows flat fee for same-currency transfer', () => {
        const str = JSON.stringify(createStablecoinFeeUI(baseFee));
        expect(str).toContain('1.5');
    });

    it('shows recipient amount', () => {
        const str = JSON.stringify(createStablecoinFeeUI(baseFee));
        expect(str).toContain('48.5');
    });

    it('handles percentage fee for cross-currency', () => {
        const str = JSON.stringify(createStablecoinFeeUI({
            ...baseFee,
            debit_currency: 'NGN',
            fee: 0.75,
            fee_type: 'percentage',
            fee_in_fiat: 11250,
        }));
        expect(str).toContain('NGN');
        expect(str).toContain('0.75');
    });
});

describe('createStablecoinTransferUI', () => {
    const baseWallet = {
        reference: 'CRYPTO-USDT-001',
        amount: 50,
        currency: 'USDT',
        debit_currency: 'USDT',
        recipient: '0xAbC1234567890dEf1234567890aBcDeF12345678',
        transfer_type: 'wallet' as const,
        status: 'NEW',
        fee: 1.5,
    };

    it('returns a UI resource for wallet transfer', () => {
        const resource = createStablecoinTransferUI(baseWallet);
        expect(resource).toBeDefined();
        expect(resource.uri).toContain('ui://stablecoin-transfer/CRYPTO-USDT-001');
    });

    it('includes wallet address', () => {
        const str = JSON.stringify(createStablecoinTransferUI(baseWallet));
        expect(str).toContain('0xAbC1234567890dEf1234567890aBcDeF12345678');
    });

    it('includes reference', () => {
        const str = JSON.stringify(createStablecoinTransferUI(baseWallet));
        expect(str).toContain('CRYPTO-USDT-001');
    });

    it('returns UI for conversion transfer', () => {
        const resource = createStablecoinTransferUI({
            ...baseWallet,
            recipient: '300408963',
            transfer_type: 'convert',
            debit_currency: 'NGN',
            currency: 'USDT',
            reference: 'CONVERT-NGN-USDT-001',
        });
        const str = JSON.stringify(resource);
        expect(str).toContain('NGN');
        expect(str).toContain('USDT');
        expect(str).toContain('CONVERT-NGN-USDT-001');
    });

    it('handles settled status', () => {
        const resource = createStablecoinTransferUI({ ...baseWallet, status: 'SUCCESSFUL' });
        expect(resource).toBeDefined();
    });
});
