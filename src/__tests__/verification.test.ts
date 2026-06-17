import { describe, it, expect } from 'vitest';
import {
    InitiateBvnSchema,
    GetBvnDetailsSchema,
    ResolveBankAccountSchema,
    VerifyCardBinSchema,
} from '../types/verification/schema.js';
import {
    createBvnConsentUI,
    createBvnDetailsUI,
    createBankAccountUI,
    createCardBinUI,
} from '../ui/index.js';

// ─── Schema tests ─────────────────────────────────────────────────────────────

describe('InitiateBvnSchema', () => {
    it('accepts valid 11-digit BVN', () => {
        expect(InitiateBvnSchema.bvn.safeParse('22415929481').success).toBe(true);
        expect(InitiateBvnSchema.bvn.safeParse('12345678901').success).toBe(true);
    });

    it('rejects BVN shorter than 11 digits', () => {
        expect(InitiateBvnSchema.bvn.safeParse('1234567890').success).toBe(false);
        expect(InitiateBvnSchema.bvn.safeParse('123').success).toBe(false);
    });

    it('rejects BVN longer than 11 digits', () => {
        expect(InitiateBvnSchema.bvn.safeParse('123456789012').success).toBe(false);
    });

    it('rejects BVN with non-digit characters', () => {
        expect(InitiateBvnSchema.bvn.safeParse('2241592948A').success).toBe(false);
        expect(InitiateBvnSchema.bvn.safeParse('22415-29481').success).toBe(false);
    });

    it('accepts valid names', () => {
        expect(InitiateBvnSchema.firstname.safeParse('Desola').success).toBe(true);
        expect(InitiateBvnSchema.lastname.safeParse('Ade').success).toBe(true);
    });

    it('rejects empty names', () => {
        expect(InitiateBvnSchema.firstname.safeParse('').success).toBe(false);
        expect(InitiateBvnSchema.lastname.safeParse('').success).toBe(false);
    });

    it('accepts valid redirect_url', () => {
        expect(InitiateBvnSchema.redirect_url.safeParse('https://myapp.com/callback').success).toBe(true);
    });

    it('rejects invalid redirect_url', () => {
        expect(InitiateBvnSchema.redirect_url.safeParse('not-a-url').success).toBe(false);
        expect(InitiateBvnSchema.redirect_url.safeParse('').success).toBe(false);
    });
});

describe('GetBvnDetailsSchema', () => {
    it('accepts valid reference', () => {
        expect(GetBvnDetailsSchema.reference.safeParse('BVN-REF-20240610-001').success).toBe(true);
        expect(GetBvnDetailsSchema.reference.safeParse('flw-bvn-abc123').success).toBe(true);
    });

    it('rejects empty reference', () => {
        expect(GetBvnDetailsSchema.reference.safeParse('').success).toBe(false);
    });
});

describe('ResolveBankAccountSchema', () => {
    it('accepts valid 10-digit account number', () => {
        expect(ResolveBankAccountSchema.account_number.safeParse('0690000040').success).toBe(true);
        expect(ResolveBankAccountSchema.account_number.safeParse('2012345678').success).toBe(true);
    });

    it('rejects account number not exactly 10 digits', () => {
        expect(ResolveBankAccountSchema.account_number.safeParse('123456789').success).toBe(false);
        expect(ResolveBankAccountSchema.account_number.safeParse('12345678901').success).toBe(false);
    });

    it('rejects account number with non-digit characters', () => {
        expect(ResolveBankAccountSchema.account_number.safeParse('069000004A').success).toBe(false);
    });

    it('accepts valid bank code', () => {
        expect(ResolveBankAccountSchema.account_bank.safeParse('044').success).toBe(true);
        expect(ResolveBankAccountSchema.account_bank.safeParse('057').success).toBe(true);
    });

    it('rejects empty bank code', () => {
        expect(ResolveBankAccountSchema.account_bank.safeParse('').success).toBe(false);
    });
});

describe('VerifyCardBinSchema', () => {
    it('accepts 6-digit BIN', () => {
        expect(VerifyCardBinSchema.bin.safeParse('553188').success).toBe(true);
        expect(VerifyCardBinSchema.bin.safeParse('404042').success).toBe(true);
        expect(VerifyCardBinSchema.bin.safeParse('340614').success).toBe(true);
    });

    it('accepts 7-digit and 8-digit BIN', () => {
        expect(VerifyCardBinSchema.bin.safeParse('5531886').success).toBe(true);
        expect(VerifyCardBinSchema.bin.safeParse('55318866').success).toBe(true);
    });

    it('rejects BIN shorter than 6 digits', () => {
        expect(VerifyCardBinSchema.bin.safeParse('55318').success).toBe(false);
        expect(VerifyCardBinSchema.bin.safeParse('123').success).toBe(false);
    });

    it('rejects BIN longer than 8 digits', () => {
        expect(VerifyCardBinSchema.bin.safeParse('553188665').success).toBe(false);
    });

    it('rejects BIN with non-digit characters', () => {
        expect(VerifyCardBinSchema.bin.safeParse('55318X').success).toBe(false);
        expect(VerifyCardBinSchema.bin.safeParse('553-18').success).toBe(false);
    });
});

// ─── UI tests ─────────────────────────────────────────────────────────────────

describe('createBvnConsentUI', () => {
    const baseConsent = {
        reference: 'BVN-REF-001',
        url: 'https://bvn.flutterwave.com/consent/abc123',
        firstname: 'Desola',
        lastname: 'Ade',
        bvn_last4: '9481',
        redirect_url: 'https://myapp.com/callback',
    };

    it('returns a UI resource with correct uri', () => {
        const resource = createBvnConsentUI(baseConsent);
        expect(resource).toBeDefined();
        expect(resource.uri).toContain('ui://bvn-consent/');
        expect(resource.uri).toContain('BVN-REF-001');
    });

    it('includes customer name in output', () => {
        const str = JSON.stringify(createBvnConsentUI(baseConsent));
        expect(str).toContain('Desola');
        expect(str).toContain('Ade');
    });

    it('includes consent URL when present', () => {
        const str = JSON.stringify(createBvnConsentUI(baseConsent));
        expect(str).toContain('bvn.flutterwave.com/consent/abc123');
    });

    it('shows different message when url is null (already consented)', () => {
        const str = JSON.stringify(createBvnConsentUI({ ...baseConsent, url: null }));
        expect(str).toContain('already');
    });

    it('masks BVN — only shows last 4', () => {
        const str = JSON.stringify(createBvnConsentUI(baseConsent));
        expect(str).toContain('9481');
        expect(str).not.toContain('22415929481');
    });
});

describe('createBvnDetailsUI', () => {
    const baseDetails = {
        reference: 'BVN-REF-001',
        status: 'COMPLETED',
        first_name: 'Desola',
        last_name: 'Ade',
        bvn: '22415929481',
        dob: '1990-01-15',
        gender: 'Female',
        phone: '+2348012345678',
        state_of_origin: 'Lagos',
    };

    it('returns a UI resource', () => {
        const resource = createBvnDetailsUI(baseDetails);
        expect(resource).toBeDefined();
        expect(resource.uri).toContain('ui://bvn-details/');
    });

    it('includes customer identity fields', () => {
        const str = JSON.stringify(createBvnDetailsUI(baseDetails));
        expect(str).toContain('Desola');
        expect(str).toContain('1990-01-15');
        expect(str).toContain('Lagos');
    });

    it('partially masks BVN', () => {
        const str = JSON.stringify(createBvnDetailsUI(baseDetails));
        expect(str).not.toContain('22415929481');
    });

    it('renders watchlisted flag when true', () => {
        const str = JSON.stringify(createBvnDetailsUI({ ...baseDetails, watchlisted: true }));
        expect(str).toContain('atchlist');
    });

    it('handles PENDING status', () => {
        const resource = createBvnDetailsUI({ ...baseDetails, status: 'PENDING' });
        expect(resource).toBeDefined();
    });

    it('handles minimal data gracefully', () => {
        const resource = createBvnDetailsUI({ reference: 'REF-001', status: 'PENDING' });
        expect(resource).toBeDefined();
    });
});

describe('createBankAccountUI', () => {
    const baseAccount = {
        account_number: '0690000040',
        account_name: 'Desola Ade',
        bank_code: '044',
    };

    it('returns a UI resource with correct uri', () => {
        const resource = createBankAccountUI(baseAccount);
        expect(resource).toBeDefined();
        expect(resource.uri).toContain('ui://bank-account/');
        expect(resource.uri).toContain('0690000040');
    });

    it('includes account name prominently', () => {
        const str = JSON.stringify(createBankAccountUI(baseAccount));
        expect(str).toContain('Desola Ade');
    });

    it('includes account number and bank code', () => {
        const str = JSON.stringify(createBankAccountUI(baseAccount));
        expect(str).toContain('0690000040');
        expect(str).toContain('044');
    });
});

describe('createCardBinUI', () => {
    const baseBin = {
        bin: '553188',
        brand: 'MASTERCARD',
        type: 'CREDIT',
        issuer: 'NEXUS MERCHANT BANK',
        country: 'NIGERIA',
        country_code: 'NG',
    };

    it('returns a UI resource with correct uri', () => {
        const resource = createCardBinUI(baseBin);
        expect(resource).toBeDefined();
        expect(resource.uri).toContain('ui://card-bin/');
        expect(resource.uri).toContain('553188');
    });

    it('includes brand and card type', () => {
        const str = JSON.stringify(createCardBinUI(baseBin));
        expect(str).toContain('MASTERCARD');
        expect(str).toContain('CREDIT');
    });

    it('includes issuer and country', () => {
        const str = JSON.stringify(createCardBinUI(baseBin));
        expect(str).toContain('NEXUS MERCHANT BANK');
        expect(str).toContain('NIGERIA');
    });

    it('handles VISA card', () => {
        const str = JSON.stringify(createCardBinUI({ bin: '404042', brand: 'VISA', type: 'DEBIT' }));
        expect(str).toContain('VISA');
        expect(str).toContain('DEBIT');
    });

    it('handles AMEX card', () => {
        const str = JSON.stringify(createCardBinUI({ bin: '340614', brand: 'AMERICAN EXPRESS', type: 'CREDIT' }));
        expect(str).toContain('AMERICAN EXPRESS');
    });

    it('handles minimal data (unknown brand)', () => {
        const resource = createCardBinUI({ bin: '123456' });
        expect(resource).toBeDefined();
    });
});
