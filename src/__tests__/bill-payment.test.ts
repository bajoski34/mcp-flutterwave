import { describe, it, expect } from 'vitest';
import {
    GetBillProvidersSchema,
    GetBillItemsSchema,
    ValidateBillCustomerSchema,
    PayBillSchema,
    GetBillStatusSchema,
    BILL_CATEGORIES,
} from '../types/bill-payment/schema.js';
import { createBillPaymentUI, createBillStatusUI } from '../ui/index.js';

// ─── Schema tests ─────────────────────────────────────────────────────────────

describe('GetBillProvidersSchema', () => {
    it('accepts all valid categories', () => {
        for (const cat of BILL_CATEGORIES) {
            expect(GetBillProvidersSchema.category.safeParse(cat).success).toBe(true);
        }
    });

    it('rejects unknown category', () => {
        expect(GetBillProvidersSchema.category.safeParse('ELECTRICITY').success).toBe(false);
        expect(GetBillProvidersSchema.category.safeParse('').success).toBe(false);
        expect(GetBillProvidersSchema.category.safeParse('airtime').success).toBe(false);
    });
});

describe('GetBillItemsSchema', () => {
    it('accepts valid biller_code', () => {
        expect(GetBillItemsSchema.biller_code.safeParse('BIL119').success).toBe(true);
        expect(GetBillItemsSchema.biller_code.safeParse('BIL001').success).toBe(true);
    });

    it('rejects empty biller_code', () => {
        expect(GetBillItemsSchema.biller_code.safeParse('').success).toBe(false);
    });
});

describe('ValidateBillCustomerSchema', () => {
    it('accepts valid item_code and customer_id', () => {
        expect(ValidateBillCustomerSchema.item_code.safeParse('AT099').success).toBe(true);
        expect(ValidateBillCustomerSchema.customer_id.safeParse('08034985033').success).toBe(true);
    });

    it('accepts meter number as customer_id', () => {
        expect(ValidateBillCustomerSchema.customer_id.safeParse('04223785521').success).toBe(true);
    });

    it('rejects empty item_code', () => {
        expect(ValidateBillCustomerSchema.item_code.safeParse('').success).toBe(false);
    });

    it('rejects empty customer_id', () => {
        expect(ValidateBillCustomerSchema.customer_id.safeParse('').success).toBe(false);
    });
});

describe('PayBillSchema', () => {
    it('accepts full valid payload', () => {
        expect(PayBillSchema.biller_code.safeParse('BIL119').success).toBe(true);
        expect(PayBillSchema.item_code.safeParse('AT099').success).toBe(true);
        expect(PayBillSchema.customer_id.safeParse('08034985033').success).toBe(true);
        expect(PayBillSchema.amount.safeParse(500).success).toBe(true);
        expect(PayBillSchema.country.safeParse('NG').success).toBe(true);
    });

    it('defaults country to NG', () => {
        const result = PayBillSchema.country.safeParse(undefined);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBe('NG');
        }
    });

    it('rejects zero or negative amount', () => {
        expect(PayBillSchema.amount.safeParse(0).success).toBe(false);
        expect(PayBillSchema.amount.safeParse(-100).success).toBe(false);
    });

    it('rejects invalid callback_url', () => {
        expect(PayBillSchema.callback_url.safeParse('not-a-url').success).toBe(false);
    });

    it('accepts valid callback_url', () => {
        expect(PayBillSchema.callback_url.safeParse('https://myapp.com/bills/callback').success).toBe(true);
    });

    it('accepts undefined callback_url', () => {
        expect(PayBillSchema.callback_url.safeParse(undefined).success).toBe(true);
    });

    it('rejects empty biller_code', () => {
        expect(PayBillSchema.biller_code.safeParse('').success).toBe(false);
    });
});

describe('GetBillStatusSchema', () => {
    it('accepts valid reference', () => {
        expect(GetBillStatusSchema.reference.safeParse('BILL-AIRTIME-NGN-20240610-001').success).toBe(true);
    });

    it('rejects empty reference', () => {
        expect(GetBillStatusSchema.reference.safeParse('').success).toBe(false);
    });
});

// ─── UI tests ─────────────────────────────────────────────────────────────────

describe('createBillPaymentUI', () => {
    const baseData = {
        reference: 'BILL-AIRTIME-001',
        biller_code: 'BIL119',
        item_code: 'AT099',
        customer_id: '08034985033',
        amount: 500,
        status: 'successful',
    };

    it('returns a UI resource with uri', () => {
        const resource = createBillPaymentUI(baseData);
        expect(resource).toBeDefined();
        expect(resource.uri).toContain('ui://bill-payment/');
    });

    it('includes reference in URI', () => {
        const resource = createBillPaymentUI(baseData);
        expect(resource.uri).toContain('BILL-AIRTIME-001');
    });

    it('handles pending status', () => {
        const resource = createBillPaymentUI({ ...baseData, status: 'pending' });
        expect(resource).toBeDefined();
    });

    it('handles failed status', () => {
        const resource = createBillPaymentUI({ ...baseData, status: 'failed' });
        expect(resource).toBeDefined();
    });

    it('renders prepaid token when provided', () => {
        const resource = createBillPaymentUI({ ...baseData, token: '1234-5678-9012-3456' });
        expect(JSON.stringify(resource)).toContain('1234-5678-9012-3456');
    });

    it('renders without token', () => {
        const resource = createBillPaymentUI(baseData);
        expect(resource).toBeDefined();
        expect(resource.uri).toBeTruthy();
    });

    it('includes biller_code and customer_id in HTML', () => {
        const str = JSON.stringify(createBillPaymentUI(baseData));
        expect(str).toContain('BIL119');
        expect(str).toContain('08034985033');
    });
});

describe('createBillStatusUI', () => {
    const baseData = {
        reference: 'BILL-ELEC-001',
        amount: 5000,
        status: 'successful',
    };

    it('returns a UI resource', () => {
        const resource = createBillStatusUI(baseData);
        expect(resource).toBeDefined();
        expect(resource.uri).toContain('ui://bill-status/');
    });

    it('includes reference in URI', () => {
        const resource = createBillStatusUI(baseData);
        expect(resource.uri).toContain('BILL-ELEC-001');
    });

    it('renders token with share note when provided', () => {
        const str = JSON.stringify(createBillStatusUI({ ...baseData, token: '9876-5432-1098-7654' }));
        expect(str).toContain('9876-5432-1098-7654');
        expect(str).toContain('Share this token');
    });

    it('handles optional fields gracefully', () => {
        const str = JSON.stringify(createBillStatusUI({
            reference: 'BILL-001',
            amount: 1000,
            status: 'pending',
            biller: 'MTN',
            customer: '08034985033',
            completed_at: '2024-06-10T10:00:00Z',
        }));
        expect(str).toContain('MTN');
        expect(str).toContain('08034985033');
    });

    it('handles pending and failed statuses', () => {
        expect(createBillStatusUI({ ...baseData, status: 'pending' })).toBeDefined();
        expect(createBillStatusUI({ ...baseData, status: 'failed' })).toBeDefined();
    });
});
