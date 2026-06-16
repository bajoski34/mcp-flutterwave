import { describe, it, expect } from 'vitest';
import { CheckoutPayloadSchema, DisableCheckoutSchema } from '../types/checkout/schema.js';
import { CreateTransferPayloadSchema, CreateBeneficiaryPayloadSchema } from '../types/transfer/schema.js';
import { CreatePlanPayloadSchema, GetPlansFiltersSchema } from '../types/plan/schema.js';

describe('CheckoutPayloadSchema', () => {
    it('accepts valid tx_ref', () => {
        expect(CheckoutPayloadSchema.tx_ref.safeParse('TXN-001').success).toBe(true);
    });
    it('rejects empty tx_ref', () => {
        expect(CheckoutPayloadSchema.tx_ref.safeParse('').success).toBe(false);
    });
    it('accepts valid redirect_url', () => {
        expect(CheckoutPayloadSchema.redirect_url.safeParse('https://example.com').success).toBe(true);
    });
    it('rejects invalid redirect_url', () => {
        expect(CheckoutPayloadSchema.redirect_url.safeParse('not-a-url').success).toBe(false);
    });
    it('accepts valid customer email', () => {
        expect(CheckoutPayloadSchema.customer.safeParse({ email: 'test@example.com', name: 'John', phonenumber: '0801' }).success).toBe(true);
    });
    it('rejects invalid customer email', () => {
        expect(CheckoutPayloadSchema.customer.safeParse({ email: 'not-email', name: 'John', phonenumber: '0801' }).success).toBe(false);
    });
});

describe('DisableCheckoutSchema', () => {
    it('accepts valid URL', () => {
        expect(DisableCheckoutSchema.link.safeParse('https://pay.flutterwave.com/link/abc').success).toBe(true);
    });
    it('rejects non-URL', () => {
        expect(DisableCheckoutSchema.link.safeParse('abc').success).toBe(false);
    });
});

describe('CreateTransferPayloadSchema', () => {
    it('accepts valid amount', () => {
        expect(CreateTransferPayloadSchema.amount.safeParse(5000).success).toBe(true);
    });
    it('rejects zero amount', () => {
        expect(CreateTransferPayloadSchema.amount.safeParse(0).success).toBe(false);
    });
    it('accepts optional callback_url when valid', () => {
        expect(CreateTransferPayloadSchema.callback_url.safeParse('https://example.com').success).toBe(true);
    });
    it('accepts undefined callback_url', () => {
        expect(CreateTransferPayloadSchema.callback_url.safeParse(undefined).success).toBe(true);
    });
});

describe('CreateBeneficiaryPayloadSchema', () => {
    it('rejects empty beneficiary_name', () => {
        expect(CreateBeneficiaryPayloadSchema.beneficiary_name.safeParse('').success).toBe(false);
    });
    it('accepts valid beneficiary_name', () => {
        expect(CreateBeneficiaryPayloadSchema.beneficiary_name.safeParse('Jane Doe').success).toBe(true);
    });
});

describe('CreatePlanPayloadSchema', () => {
    it('accepts valid interval', () => {
        expect(CreatePlanPayloadSchema.interval.safeParse('monthly').success).toBe(true);
    });
    it('rejects invalid interval', () => {
        expect(CreatePlanPayloadSchema.interval.safeParse('hourly').success).toBe(false);
    });
    it('accepts positive amount', () => {
        expect(CreatePlanPayloadSchema.amount.safeParse(1000).success).toBe(true);
    });
    it('rejects negative amount', () => {
        expect(CreatePlanPayloadSchema.amount.safeParse(-100).success).toBe(false);
    });
});

describe('GetPlansFiltersSchema', () => {
    it('accepts valid status', () => {
        expect(GetPlansFiltersSchema.status.safeParse('active').success).toBe(true);
    });
    it('rejects unknown status', () => {
        expect(GetPlansFiltersSchema.status.safeParse('deleted').success).toBe(false);
    });
    it('accepts undefined status', () => {
        expect(GetPlansFiltersSchema.status.safeParse(undefined).success).toBe(true);
    });
});
