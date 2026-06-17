import { describe, it, expect } from 'vitest';
import {
    RequestFxQuoteSchema,
    GetFxQuoteSchema,
    InitiateFxTradeSchema,
    GetFxTradeSchema,
    FX_CURRENCIES,
} from '../types/fx-trade/schema.js';
import { createFxQuoteUI, createFxTradeUI } from '../ui/index.js';

// ─── Schema tests ─────────────────────────────────────────────────────────────

describe('RequestFxQuoteSchema', () => {
    it('accepts valid NGN/USD pair', () => {
        expect(RequestFxQuoteSchema.base_currency.safeParse('NGN').success).toBe(true);
        expect(RequestFxQuoteSchema.target_currency.safeParse('USD').success).toBe(true);
        expect(RequestFxQuoteSchema.quantity.safeParse(1617759).success).toBe(true);
    });

    it('accepts all supported currencies', () => {
        for (const ccy of FX_CURRENCIES) {
            expect(RequestFxQuoteSchema.base_currency.safeParse(ccy).success).toBe(true);
            expect(RequestFxQuoteSchema.target_currency.safeParse(ccy).success).toBe(true);
        }
    });

    it('rejects unsupported currency', () => {
        expect(RequestFxQuoteSchema.base_currency.safeParse('EUR').success).toBe(false);
        expect(RequestFxQuoteSchema.base_currency.safeParse('KES').success).toBe(false);
        expect(RequestFxQuoteSchema.target_currency.safeParse('GBP').success).toBe(false);
    });

    it('rejects zero or negative quantity', () => {
        expect(RequestFxQuoteSchema.quantity.safeParse(0).success).toBe(false);
        expect(RequestFxQuoteSchema.quantity.safeParse(-100).success).toBe(false);
    });

    it('accepts positive quantity', () => {
        expect(RequestFxQuoteSchema.quantity.safeParse(1000).success).toBe(true);
        expect(RequestFxQuoteSchema.quantity.safeParse(0.01).success).toBe(true);
    });

    it('accepts optional reference', () => {
        expect(RequestFxQuoteSchema.reference.safeParse(undefined).success).toBe(true);
        expect(RequestFxQuoteSchema.reference.safeParse('FX-001').success).toBe(true);
    });

    it('accepts valid test scenario', () => {
        expect(RequestFxQuoteSchema.scenario.safeParse('ready').success).toBe(true);
        expect(RequestFxQuoteSchema.scenario.safeParse('expired').success).toBe(true);
        expect(RequestFxQuoteSchema.scenario.safeParse('invalid_amount').success).toBe(true);
        expect(RequestFxQuoteSchema.scenario.safeParse('exceeded_limit').success).toBe(true);
    });

    it('rejects invalid scenario', () => {
        expect(RequestFxQuoteSchema.scenario.safeParse('production_mode').success).toBe(false);
    });

    it('accepts undefined scenario', () => {
        expect(RequestFxQuoteSchema.scenario.safeParse(undefined).success).toBe(true);
    });
});

describe('GetFxQuoteSchema', () => {
    it('accepts valid quote_id', () => {
        expect(GetFxQuoteSchema.quote_id.safeParse('c085aab5-5938-46a7-90a9-22420c2a8d6e').success).toBe(true);
    });

    it('rejects empty quote_id', () => {
        expect(GetFxQuoteSchema.quote_id.safeParse('').success).toBe(false);
    });
});

describe('InitiateFxTradeSchema', () => {
    it('accepts valid quote_id and narration', () => {
        expect(InitiateFxTradeSchema.quote_id.safeParse('c085aab5-5938-46a7-90a9-22420c2a8d6e').success).toBe(true);
        expect(InitiateFxTradeSchema.narration.safeParse('Q1 vendor payment').success).toBe(true);
    });

    it('rejects empty quote_id', () => {
        expect(InitiateFxTradeSchema.quote_id.safeParse('').success).toBe(false);
    });

    it('rejects empty narration', () => {
        expect(InitiateFxTradeSchema.narration.safeParse('').success).toBe(false);
    });
});

describe('GetFxTradeSchema', () => {
    it('accepts valid trade_id', () => {
        expect(GetFxTradeSchema.trade_id.safeParse('30b85c03-9124-4418-b30b-0495ffbdc633').success).toBe(true);
    });

    it('rejects empty trade_id', () => {
        expect(GetFxTradeSchema.trade_id.safeParse('').success).toBe(false);
    });
});

// ─── UI tests ─────────────────────────────────────────────────────────────────

describe('createFxQuoteUI', () => {
    const baseQuote = {
        quote_id: 'c085aab5-5938-46a7-90a9-22420c2a8d6e',
        reference: 'FX-NGN-USD-001',
        instrument: 'NGN/USD',
        quantity: 1617759,
        status: 'READY',
        rate: '0.000659',
        approved_quantity: 1517759,
        total_value: 1000.2,
        expiry: '2026-02-06T10:12:02.990Z',
    };

    it('returns a UI resource with correct uri', () => {
        const resource = createFxQuoteUI(baseQuote);
        expect(resource).toBeDefined();
        expect(resource.uri).toContain('ui://fx-quote/');
        expect(resource.uri).toContain('c085aab5');
    });

    it('includes instrument in output', () => {
        const str = JSON.stringify(createFxQuoteUI(baseQuote));
        expect(str).toContain('NGN/USD');
    });

    it('includes reference in output', () => {
        const str = JSON.stringify(createFxQuoteUI(baseQuote));
        expect(str).toContain('FX-NGN-USD-001');
    });

    it('renders READY state with initiate note', () => {
        const str = JSON.stringify(createFxQuoteUI(baseQuote));
        expect(str).toContain('READY');
        expect(str).toContain('initiate_fx_trade');
    });

    it('renders NEW status without rate info', () => {
        const str = JSON.stringify(createFxQuoteUI({ ...baseQuote, status: 'NEW', rate: undefined, total_value: undefined }));
        expect(str).toContain('NEW');
        expect(str).toContain('get_fx_quote');
    });

    it('renders FAILED status with error message', () => {
        const str = JSON.stringify(createFxQuoteUI({
            ...baseQuote,
            status: 'FAILED',
            rate: undefined,
            complete_message: 'Minimum amount is NGN 1517759.30.',
        }));
        expect(str).toContain('FAILED');
        expect(str).toContain('Minimum amount');
    });

    it('handles EXPIRED status', () => {
        const resource = createFxQuoteUI({ ...baseQuote, status: 'EXPIRED' });
        expect(resource).toBeDefined();
    });
});

describe('createFxTradeUI', () => {
    const baseTrade = {
        trade_id: '30b85c03-9124-4418-b30b-0495ffbdc633',
        reference: 'TRD-86ade016977958e2',
        instrument: 'NGN/USD',
        quantity: 1617759,
        approved_quantity: 1517759,
        price: 1000.2,
        status: 'SETTLED',
        narration: 'Q1 vendor payment',
        recipient: { id: '200004751', name: 'MythCo.' },
        created_at: '2026-02-06T10:08:54.000Z',
    };

    it('returns a UI resource with correct uri', () => {
        const resource = createFxTradeUI(baseTrade);
        expect(resource).toBeDefined();
        expect(resource.uri).toContain('ui://fx-trade/');
        expect(resource.uri).toContain('30b85c03');
    });

    it('includes trade reference in output', () => {
        const str = JSON.stringify(createFxTradeUI(baseTrade));
        expect(str).toContain('TRD-86ade016977958e2');
    });

    it('renders settled state with wallet credit note', () => {
        const str = JSON.stringify(createFxTradeUI(baseTrade));
        expect(str).toContain('SETTLED');
        expect(str).toContain('USD');
        expect(str).toContain('wallet');
    });

    it('renders recipient name', () => {
        const str = JSON.stringify(createFxTradeUI(baseTrade));
        expect(str).toContain('MythCo.');
    });

    it('renders narration', () => {
        const str = JSON.stringify(createFxTradeUI(baseTrade));
        expect(str).toContain('Q1 vendor payment');
    });

    it('renders PENDING state with poll note', () => {
        const str = JSON.stringify(createFxTradeUI({ ...baseTrade, status: 'PENDING' }));
        expect(str).toContain('PENDING');
        expect(str).toContain('get_fx_trade');
    });

    it('renders FAILED state with response message', () => {
        const str = JSON.stringify(createFxTradeUI({
            ...baseTrade,
            status: 'FAILED',
            response_message: 'Insufficient balance in customer wallet',
        }));
        expect(str).toContain('FAILED');
        expect(str).toContain('Insufficient balance');
    });

    it('handles quantity variance (approved differs from requested)', () => {
        const str = JSON.stringify(createFxTradeUI({ ...baseTrade, quantity: 1617759, approved_quantity: 1517759 }));
        expect(str).toContain('1,517,759');
        expect(str).toContain('1,617,759');
    });
});
