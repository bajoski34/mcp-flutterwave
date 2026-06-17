import { describe, it, expect } from 'vitest';
import {
    createTransactionUI, createCheckoutUI, createTransferUI, createTimelineUI,
    createChargeUI, createPinAuthUI, createAvsAuthUI, create3dsRedirectUI, createOtpPromptUI,
} from '../ui/index.js';

describe('createTransactionUI', () => {
    it('renders transaction ID', () => {
        const resource = createTransactionUI({ tx_id: 'TX-001', status: 'successful', amount: 5000, currency: 'NGN' });
        expect(JSON.stringify(resource)).toContain('TX-001');
    });
    it('renders amount and currency', () => {
        const resource = createTransactionUI({ tx_id: 'TX-002', status: 'pending', amount: 12500, currency: 'USD' });
        const str = JSON.stringify(resource);
        expect(str).toContain('USD');
        expect(str).toContain('12');
    });
    it('renders customer name when provided', () => {
        const resource = createTransactionUI({ tx_id: 'TX-003', status: 'successful', amount: 1000, currency: 'NGN', customer: { name: 'Jane Doe' } });
        expect(JSON.stringify(resource)).toContain('Jane Doe');
    });
    it('renders success status class', () => {
        const resource = createTransactionUI({ tx_id: 'TX-004', status: 'successful', amount: 1000, currency: 'NGN' });
        expect(JSON.stringify(resource)).toContain('status success');
    });
    it('renders failed status class', () => {
        const resource = createTransactionUI({ tx_id: 'TX-005', status: 'failed', amount: 1000, currency: 'NGN' });
        expect(JSON.stringify(resource)).toContain('status failed');
    });
    it('renders pending status class', () => {
        const resource = createTransactionUI({ tx_id: 'TX-006', status: 'pending', amount: 1000, currency: 'NGN' });
        expect(JSON.stringify(resource)).toContain('status pending');
    });
});

describe('createCheckoutUI', () => {
    it('renders payment link', () => {
        const resource = createCheckoutUI({ link: 'https://pay.flutterwave.com/abc', customer: { name: 'John', email: 'john@example.com' }, amount: 2000, currency: 'NGN' });
        expect(JSON.stringify(resource)).toContain('https://pay.flutterwave.com/abc');
    });
    it('renders customer details', () => {
        const resource = createCheckoutUI({ link: 'https://pay.flutterwave.com/abc', customer: { name: 'Ada Obi', email: 'ada@example.com' }, amount: 5000, currency: 'NGN' });
        const str = JSON.stringify(resource);
        expect(str).toContain('Ada Obi');
        expect(str).toContain('ada@example.com');
    });
    it('renders amount', () => {
        const resource = createCheckoutUI({ link: 'https://pay.flutterwave.com/abc', customer: { name: 'Test', email: 'test@example.com' }, amount: 99999, currency: 'GHS' });
        const str = JSON.stringify(resource);
        expect(str).toContain('GHS');
        expect(str).toContain('99');
    });
});

describe('createTransferUI', () => {
    it('renders transfer reference', () => {
        const resource = createTransferUI({ reference: 'TRF-XYZ', amount: 3000, currency: 'NGN', beneficiary: {}, status: 'pending' });
        expect(JSON.stringify(resource)).toContain('TRF-XYZ');
    });
    it('renders beneficiary name when provided', () => {
        const resource = createTransferUI({ reference: 'TRF-ABC', amount: 1000, currency: 'NGN', beneficiary: { name: 'Emeka Eze', account_number: '0123456789', bank_name: 'Access Bank' }, status: 'successful' });
        const str = JSON.stringify(resource);
        expect(str).toContain('Emeka Eze');
        expect(str).toContain('0123456789');
        expect(str).toContain('Access Bank');
    });
    it('renders pending status', () => {
        const resource = createTransferUI({ reference: 'TRF-DEF', amount: 500, currency: 'NGN', beneficiary: {}, status: 'pending' });
        expect(JSON.stringify(resource)).toContain('status pending');
    });
});

describe('createTimelineUI', () => {
    it('returns empty state for null timeline', () => {
        const resource = createTimelineUI('TX-001', null);
        expect(JSON.stringify(resource)).toContain('No timeline data available');
    });
    it('returns empty state for empty array', () => {
        const resource = createTimelineUI('TX-002', []);
        expect(JSON.stringify(resource)).toContain('No timeline data available');
    });
    it('renders array timeline events', () => {
        const timeline = [{ event: 'initiated', created_at: '2024-01-01T10:00:00Z' }, { event: 'completed', created_at: '2024-01-01T10:01:00Z' }];
        const resource = createTimelineUI('TX-003', timeline);
        const str = JSON.stringify(resource);
        expect(str).toContain('initiated');
        expect(str).toContain('completed');
    });
    it('renders object timeline', () => {
        const timeline = { step1: 'payment initiated', step2: 'payment confirmed' };
        const resource = createTimelineUI('TX-004', timeline);
        const str = JSON.stringify(resource);
        expect(str).toContain('step1');
        expect(str).toContain('payment initiated');
    });
    it('includes transaction id in uri', () => {
        const resource = createTimelineUI('MY-TX-999', [{ event: 'done', created_at: '2024-01-01T00:00:00Z' }]);
        expect(JSON.stringify(resource)).toContain('MY-TX-999');
    });
});

describe('createChargeUI', () => {
    it('renders transaction reference', () => {
        const resource = createChargeUI({ tx_ref: 'MC-001', status: 'pending', amount: 5000, currency: 'NGN', charge_type: 'card', email: 'user@example.com' });
        expect(JSON.stringify(resource)).toContain('MC-001');
    });
    it('renders customer email', () => {
        const resource = createChargeUI({ tx_ref: 'MC-002', status: 'pending', amount: 1000, currency: 'NGN', charge_type: 'account', email: 'ada@example.com' });
        expect(JSON.stringify(resource)).toContain('ada@example.com');
    });
    it('renders amount and currency', () => {
        const resource = createChargeUI({ tx_ref: 'MC-003', status: 'successful', amount: 2500, currency: 'KES', charge_type: 'mpesa', email: 'test@example.com' });
        const str = JSON.stringify(resource);
        expect(str).toContain('KES');
        expect(str).toContain('2');
    });
    it('renders pending status class', () => {
        const resource = createChargeUI({ tx_ref: 'MC-004', status: 'pending', amount: 500, currency: 'NGN', charge_type: 'ussd', email: 'user@example.com' });
        expect(JSON.stringify(resource)).toContain('status pending');
    });
    it('renders success status class', () => {
        const resource = createChargeUI({ tx_ref: 'MC-005', status: 'successful', amount: 100, currency: 'GHS', charge_type: 'mobile_money_ghana', email: 'user@example.com' });
        expect(JSON.stringify(resource)).toContain('status success');
    });
    it('renders flw_ref when provided', () => {
        const resource = createChargeUI({ tx_ref: 'MC-006', status: 'pending', amount: 100, currency: 'NGN', charge_type: 'card', email: 'user@example.com', flw_ref: 'FLW-MOCK-abc123' });
        expect(JSON.stringify(resource)).toContain('FLW-MOCK-abc123');
    });
    it('renders auth_mode when provided', () => {
        const resource = createChargeUI({ tx_ref: 'MC-007', status: 'pending', amount: 100, currency: 'NGN', charge_type: 'card', email: 'user@example.com', auth_mode: 'pin' });
        expect(JSON.stringify(resource)).toContain('pin');
    });
    it('renders customer fullname when provided', () => {
        const resource = createChargeUI({ tx_ref: 'MC-008', status: 'successful', amount: 100, currency: 'NGN', charge_type: 'card', email: 'user@example.com', fullname: 'Yemi Desola' });
        expect(JSON.stringify(resource)).toContain('Yemi Desola');
    });
    it('renders charge type label in header', () => {
        const resource = createChargeUI({ tx_ref: 'MC-009', status: 'pending', amount: 100, currency: 'UGX', charge_type: 'mobile_money_uganda', email: 'user@example.com' });
        expect(JSON.stringify(resource)).toContain('Mobile Money Uganda');
    });
});

describe('createPinAuthUI', () => {
    it('renders transaction reference', () => {
        const resource = createPinAuthUI({ tx_ref: 'MC-PIN-001', charge_type: 'card' });
        expect(JSON.stringify(resource)).toContain('MC-PIN-001');
    });
    it('renders PIN Required heading', () => {
        const resource = createPinAuthUI({ tx_ref: 'MC-PIN-002', charge_type: 'card' });
        expect(JSON.stringify(resource)).toContain('PIN Required');
    });
    it('renders charge_type label', () => {
        const resource = createPinAuthUI({ tx_ref: 'MC-PIN-003', charge_type: 'card' });
        expect(JSON.stringify(resource)).toContain('Card');
    });
    it('includes instruction to call charge_card again', () => {
        const resource = createPinAuthUI({ tx_ref: 'MC-PIN-004', charge_type: 'card' });
        expect(JSON.stringify(resource)).toContain('charge_card');
    });
    it('indicates no charge made yet', () => {
        const resource = createPinAuthUI({ tx_ref: 'MC-PIN-005', charge_type: 'card' });
        expect(JSON.stringify(resource)).toContain('No charge made yet');
    });
});

describe('createAvsAuthUI', () => {
    const fields = ['city', 'address', 'state', 'country', 'zipcode'];
    it('renders transaction reference', () => {
        const resource = createAvsAuthUI({ tx_ref: 'MC-AVS-001', charge_type: 'card', fields });
        expect(JSON.stringify(resource)).toContain('MC-AVS-001');
    });
    it('renders Address Verification heading', () => {
        const resource = createAvsAuthUI({ tx_ref: 'MC-AVS-002', charge_type: 'card', fields });
        expect(JSON.stringify(resource)).toContain('Address Verification');
    });
    it('renders all required field chips', () => {
        const resource = createAvsAuthUI({ tx_ref: 'MC-AVS-003', charge_type: 'card', fields });
        const str = JSON.stringify(resource);
        fields.forEach(f => expect(str).toContain(f));
    });
    it('includes avs_noauth mode instruction', () => {
        const resource = createAvsAuthUI({ tx_ref: 'MC-AVS-004', charge_type: 'card', fields });
        expect(JSON.stringify(resource)).toContain('avs_noauth');
    });
    it('indicates no charge made yet', () => {
        const resource = createAvsAuthUI({ tx_ref: 'MC-AVS-005', charge_type: 'card', fields });
        expect(JSON.stringify(resource)).toContain('No charge made yet');
    });
});

describe('create3dsRedirectUI', () => {
    const redirectUrl = 'https://auth.flutterwave.com/tx/abc123';
    it('renders transaction reference', () => {
        const resource = create3dsRedirectUI({ tx_ref: 'MC-3DS-001', charge_type: 'card', redirect_url: redirectUrl });
        expect(JSON.stringify(resource)).toContain('MC-3DS-001');
    });
    it('renders redirect URL', () => {
        const resource = create3dsRedirectUI({ tx_ref: 'MC-3DS-002', charge_type: 'card', redirect_url: redirectUrl });
        expect(JSON.stringify(resource)).toContain(redirectUrl);
    });
    it('renders 3D Secure heading', () => {
        const resource = create3dsRedirectUI({ tx_ref: 'MC-3DS-003', charge_type: 'card', redirect_url: redirectUrl });
        expect(JSON.stringify(resource)).toContain('3D Secure');
    });
    it('renders amount and currency when provided', () => {
        const resource = create3dsRedirectUI({ tx_ref: 'MC-3DS-004', charge_type: 'card', redirect_url: redirectUrl, amount: 7500, currency: 'NGN' });
        const str = JSON.stringify(resource);
        expect(str).toContain('NGN');
        expect(str).toContain('7');
    });
    it('renders flw_ref when provided', () => {
        const resource = create3dsRedirectUI({ tx_ref: 'MC-3DS-005', charge_type: 'card', redirect_url: redirectUrl, flw_ref: 'FLW-3DS-MOCK-001' });
        expect(JSON.stringify(resource)).toContain('FLW-3DS-MOCK-001');
    });
    it('renders read_transaction instruction', () => {
        const resource = create3dsRedirectUI({ tx_ref: 'MC-3DS-006', charge_type: 'card', redirect_url: redirectUrl });
        expect(JSON.stringify(resource)).toContain('read_transaction');
    });
});

describe('createOtpPromptUI', () => {
    it('renders transaction reference', () => {
        const resource = createOtpPromptUI({ tx_ref: 'MC-OTP-001', charge_type: 'card', flw_ref: 'FLW-MOCK-OTP-001' });
        expect(JSON.stringify(resource)).toContain('MC-OTP-001');
    });
    it('renders flw_ref', () => {
        const resource = createOtpPromptUI({ tx_ref: 'MC-OTP-002', charge_type: 'card', flw_ref: 'FLW-MOCK-OTP-002' });
        expect(JSON.stringify(resource)).toContain('FLW-MOCK-OTP-002');
    });
    it('renders OTP Required heading', () => {
        const resource = createOtpPromptUI({ tx_ref: 'MC-OTP-003', charge_type: 'card', flw_ref: 'FLW-MOCK-003' });
        expect(JSON.stringify(resource)).toContain('OTP');
    });
    it('renders processor_response message when provided', () => {
        const resource = createOtpPromptUI({ tx_ref: 'MC-OTP-004', charge_type: 'card', flw_ref: 'FLW-MOCK-004', processor_response: 'OTP sent to *****0328' });
        expect(JSON.stringify(resource)).toContain('OTP sent to *****0328');
    });
    it('renders amount and currency when provided', () => {
        const resource = createOtpPromptUI({ tx_ref: 'MC-OTP-005', charge_type: 'card', flw_ref: 'FLW-MOCK-005', amount: 5000, currency: 'NGN' });
        const str = JSON.stringify(resource);
        expect(str).toContain('NGN');
        expect(str).toContain('5');
    });
    it('renders customer email when provided', () => {
        const resource = createOtpPromptUI({ tx_ref: 'MC-OTP-006', charge_type: 'card', flw_ref: 'FLW-MOCK-006', email: 'user@example.com' });
        expect(JSON.stringify(resource)).toContain('user@example.com');
    });
    it('includes validate_charge instruction', () => {
        const resource = createOtpPromptUI({ tx_ref: 'MC-OTP-007', charge_type: 'card', flw_ref: 'FLW-MOCK-007' });
        expect(JSON.stringify(resource)).toContain('validate_charge');
    });
});
