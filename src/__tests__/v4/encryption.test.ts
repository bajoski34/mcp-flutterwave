import { createDecipheriv } from 'crypto';
import { describe, expect, it } from 'vitest';
import {
  encryptCardFields,
  encryptField,
  generateNonce,
} from '../../client/encryptionV4.js';

const TEST_BASE64_KEY = Buffer.alloc(32, 7).toString('base64');
const TEST_NONCE = 'Ab12Cd34Ef56';

function decryptField(
  ciphertextBase64: string,
  base64Key: string,
  nonce: string,
): string {
  const key = Buffer.from(base64Key, 'base64');
  const combined = Buffer.from(ciphertextBase64, 'base64');
  const authTag = combined.subarray(combined.length - 16);
  const ciphertext = combined.subarray(0, combined.length - 16);
  const iv = Buffer.from(nonce, 'utf8');
  const decipher = createDecipheriv('aes-256-gcm', key, iv);

  decipher.setAuthTag(authTag);

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString('utf8');
}

describe('v4 encryption', () => {
  it('generateNonce produces a 12-character alphanumeric string', () => {
    const nonce = generateNonce();

    expect(nonce).toHaveLength(12);
    expect(nonce).toMatch(/^[a-zA-Z0-9]{12}$/);
  });

  it('encryptField output decrypts back to the original plaintext', () => {
    const plaintext = '4111111111111111';
    const encrypted = encryptField(plaintext, TEST_BASE64_KEY, TEST_NONCE);
    const decrypted = decryptField(encrypted, TEST_BASE64_KEY, TEST_NONCE);

    expect(decrypted).toBe(plaintext);
  });

  it('rejects non-12-character nonces', () => {
    expect(() =>
      encryptField('secret', TEST_BASE64_KEY, 'short'),
    ).toThrow('Nonce must be exactly 12 alphanumeric characters');
  });

  it('rejects nonces with invalid characters even when length is 12', () => {
    expect(() =>
      encryptField('secret', TEST_BASE64_KEY, 'abc-def-ghi!'),
    ).toThrow('Nonce must be exactly 12 alphanumeric characters');
  });

  it('rejects empty plaintext', () => {
    expect(() =>
      encryptField('', TEST_BASE64_KEY, TEST_NONCE),
    ).toThrow('Plaintext value must not be empty');
  });

  it('encryptCardFields produces all expected keys and decrypts with shared nonce', () => {
    const card = {
      cardNumber: '4111111111111111',
      cvv: '123',
      expiryMonth: '09',
      expiryYear: '2028',
    };

    const encrypted = encryptCardFields(card, TEST_BASE64_KEY);

    expect(Object.keys(encrypted).sort()).toEqual([
      'encrypted_card_number',
      'encrypted_cvv',
      'encrypted_expiry_month',
      'encrypted_expiry_year',
      'nonce',
    ]);
    expect(encrypted.nonce).toMatch(/^[a-zA-Z0-9]{12}$/);

    expect(
      decryptField(
        encrypted.encrypted_card_number,
        TEST_BASE64_KEY,
        encrypted.nonce,
      ),
    ).toBe(card.cardNumber);
    expect(
      decryptField(encrypted.encrypted_cvv, TEST_BASE64_KEY, encrypted.nonce),
    ).toBe(card.cvv);
    expect(
      decryptField(
        encrypted.encrypted_expiry_month,
        TEST_BASE64_KEY,
        encrypted.nonce,
      ),
    ).toBe(card.expiryMonth);
    expect(
      decryptField(
        encrypted.encrypted_expiry_year,
        TEST_BASE64_KEY,
        encrypted.nonce,
      ),
    ).toBe(card.expiryYear);
  });
});
