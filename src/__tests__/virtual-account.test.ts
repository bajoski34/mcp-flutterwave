import { describe, it, expect } from 'vitest';
import {
    CreateVirtualAccountSchema,
    GetVirtualAccountSchema,
    UpdateVirtualAccountSchema,
    ListVirtualAccountBulkSchema,
} from '../types/virtual-account/schema.js';
import { createVirtualAccountUI } from '../ui/index.js';

// ─── Schema tests ─────────────────────────────────────────────────────────────

describe('CreateVirtualAccountSchema', () => {
    it('accepts valid NGN dynamic account', () => {
        expect(CreateVirtualAccountSchema.email.safeParse('user@example.com').success).toBe(true);
        expect(CreateVirtualAccountSchema.currency.safeParse('NGN').success).toBe(true);
        expect(CreateVirtualAccountSchema.tx_ref.safeParse('VA-NGN-001').success).toBe(true);
    });

    it('accepts valid GHS account', () => {
        expect(CreateVirtualAccountSchema.currency.safeParse('GHS').success).toBe(true);
    });

    it('rejects unsupported currency', () => {
        expect(CreateVirtualAccountSchema.currency.safeParse('USD').success).toBe(false);
        expect(CreateVirtualAccountSchema.currency.safeParse('KES').success).toBe(false);
    });

    it('rejects invalid email', () => {
        expect(CreateVirtualAccountSchema.email.safeParse('not-an-email').success).toBe(false);
    });

    it('rejects empty tx_ref', () => {
        expect(CreateVirtualAccountSchema.tx_ref.safeParse('').success).toBe(false);
    });

    it('accepts positive amount', () => {
        expect(CreateVirtualAccountSchema.amount.safeParse(5000).success).toBe(true);
    });

    it('rejects zero or negative amount', () => {
        expect(CreateVirtualAccountSchema.amount.safeParse(0).success).toBe(false);
        expect(CreateVirtualAccountSchema.amount.safeParse(-100).success).toBe(false);
    });

    it('accepts undefined amount (static accounts)', () => {
        expect(CreateVirtualAccountSchema.amount.safeParse(undefined).success).toBe(true);
    });

    it('accepts valid 11-digit BVN', () => {
        expect(CreateVirtualAccountSchema.bvn.safeParse('22415929481').success).toBe(true);
    });

    it('rejects BVN shorter than 11 digits', () => {
        expect(CreateVirtualAccountSchema.bvn.safeParse('1234567890').success).toBe(false);
    });

    it('rejects BVN longer than 11 digits', () => {
        expect(CreateVirtualAccountSchema.bvn.safeParse('123456789012').success).toBe(false);
    });

    it('rejects non-numeric BVN', () => {
        expect(CreateVirtualAccountSchema.bvn.safeParse('2241592948X').success).toBe(false);
    });

    it('accepts undefined BVN (dynamic accounts)', () => {
        expect(CreateVirtualAccountSchema.bvn.safeParse(undefined).success).toBe(true);
    });

    it('accepts boolean is_permanent', () => {
        expect(CreateVirtualAccountSchema.is_permanent.safeParse(true).success).toBe(true);
        expect(CreateVirtualAccountSchema.is_permanent.safeParse(false).success).toBe(true);
    });

    it('accepts GHS frequency and duration', () => {
        expect(CreateVirtualAccountSchema.frequency.safeParse(5).success).toBe(true);
        expect(CreateVirtualAccountSchema.duration.safeParse(7).success).toBe(true);
    });

    it('rejects non-integer frequency', () => {
        expect(CreateVirtualAccountSchema.frequency.safeParse(1.5).success).toBe(false);
    });
});

describe('GetVirtualAccountSchema', () => {
    it('accepts valid order_ref', () => {
        expect(GetVirtualAccountSchema.order_ref.safeParse('URF_1234567890_8044304_NG').success).toBe(true);
    });

    it('rejects empty order_ref', () => {
        expect(GetVirtualAccountSchema.order_ref.safeParse('').success).toBe(false);
    });
});

describe('UpdateVirtualAccountSchema', () => {
    it('accepts valid order_ref and BVN', () => {
        expect(UpdateVirtualAccountSchema.order_ref.safeParse('URF_123').success).toBe(true);
        expect(UpdateVirtualAccountSchema.bvn.safeParse('22415929481').success).toBe(true);
    });

    it('rejects BVN that is not 11 digits', () => {
        expect(UpdateVirtualAccountSchema.bvn.safeParse('123').success).toBe(false);
    });
});

describe('ListVirtualAccountBulkSchema', () => {
    it('accepts valid batch_id', () => {
        expect(ListVirtualAccountBulkSchema.batch_id.safeParse('b_ABCDEF123').success).toBe(true);
    });

    it('rejects empty batch_id', () => {
        expect(ListVirtualAccountBulkSchema.batch_id.safeParse('').success).toBe(false);
    });
});

// ─── UI tests ─────────────────────────────────────────────────────────────────

describe('createVirtualAccountUI', () => {
    const baseData = {
        tx_ref: 'VA-NGN-001',
        account_number: '8044304553',
        bank_name: 'WEMA BANK',
        currency: 'NGN',
        email: 'user@example.com',
        is_permanent: false,
    };

    it('renders account number prominently', () => {
        const resource = createVirtualAccountUI(baseData);
        expect(JSON.stringify(resource)).toContain('8044304553');
    });

    it('renders bank name', () => {
        const resource = createVirtualAccountUI(baseData);
        expect(JSON.stringify(resource)).toContain('WEMA BANK');
    });

    it('renders transaction reference', () => {
        const resource = createVirtualAccountUI(baseData);
        expect(JSON.stringify(resource)).toContain('VA-NGN-001');
    });

    it('renders customer email', () => {
        const resource = createVirtualAccountUI(baseData);
        expect(JSON.stringify(resource)).toContain('user@example.com');
    });

    it('renders currency', () => {
        const resource = createVirtualAccountUI(baseData);
        expect(JSON.stringify(resource)).toContain('NGN');
    });

    it('labels dynamic account correctly', () => {
        const resource = createVirtualAccountUI({ ...baseData, is_permanent: false });
        expect(JSON.stringify(resource)).toContain('Dynamic Account');
    });

    it('labels static account correctly', () => {
        const resource = createVirtualAccountUI({ ...baseData, is_permanent: true });
        expect(JSON.stringify(resource)).toContain('Static Account');
    });

    it('renders amount when provided', () => {
        const resource = createVirtualAccountUI({ ...baseData, amount: 5000 });
        const str = JSON.stringify(resource);
        expect(str).toContain('5');
        expect(str).toContain('NGN');
    });

    it('renders order_ref when provided', () => {
        const resource = createVirtualAccountUI({ ...baseData, order_ref: 'URF_1234567890_8044304_NG' });
        expect(JSON.stringify(resource)).toContain('URF_1234567890_8044304_NG');
    });

    it('renders expiry_date when provided', () => {
        const resource = createVirtualAccountUI({ ...baseData, expiry_date: '2024-06-10 12:34:11' });
        expect(JSON.stringify(resource)).toContain('2024-06-10');
    });

    it('renders transfer instructions note when provided', () => {
        const resource = createVirtualAccountUI({ ...baseData, note: 'Please make a bank transfer to WEMA BANK' });
        expect(JSON.stringify(resource)).toContain('Please make a bank transfer');
    });

    it('renders GHS account correctly', () => {
        const resource = createVirtualAccountUI({ ...baseData, currency: 'GHS', bank_name: 'GH ACCESS BANK' });
        const str = JSON.stringify(resource);
        expect(str).toContain('GHS');
        expect(str).toContain('GH ACCESS BANK');
    });
});
