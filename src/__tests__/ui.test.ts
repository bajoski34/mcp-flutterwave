import { describe, it, expect } from 'vitest';
import { createTransactionUI, createCheckoutUI, createTransferUI, createTimelineUI } from '../ui/index.js';

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
