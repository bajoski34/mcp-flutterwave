import { createCipheriv, randomBytes } from 'crypto';

const NONCE_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export interface CardFields {
  cardNumber: string;
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface EncryptedCardFields {
  nonce: string;
  encrypted_card_number: string;
  encrypted_cvv: string;
  encrypted_expiry_month: string;
  encrypted_expiry_year: string;
}

export function generateNonce(): string {
  const bytes = randomBytes(12);
  let nonce = '';

  for (let i = 0; i < 12; i++) {
    nonce += NONCE_ALPHABET[bytes[i]! % NONCE_ALPHABET.length];
  }

  return nonce;
}

export function encryptField(
  plaintext: string,
  base64Key: string,
  nonce: string,
): string {
  if (plaintext === '') {
    throw new Error('Plaintext value must not be empty');
  }

  if (!/^[a-zA-Z0-9]{12}$/.test(nonce)) {
    throw new Error('Nonce must be exactly 12 alphanumeric characters');
  }

  const key = Buffer.from(base64Key, 'base64');
  if (key.length !== 32) {
    throw new Error('Encryption key must decode to 32 bytes for AES-256');
  }

  const iv = Buffer.from(nonce, 'utf8');
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([encrypted, authTag]).toString('base64');
}

export function encryptCardFields(
  card: CardFields,
  base64Key: string,
): EncryptedCardFields {
  const nonce = generateNonce();

  return {
    nonce,
    encrypted_card_number: encryptField(card.cardNumber, base64Key, nonce),
    encrypted_cvv: encryptField(card.cvv, base64Key, nonce),
    encrypted_expiry_month: encryptField(card.expiryMonth, base64Key, nonce),
    encrypted_expiry_year: encryptField(card.expiryYear, base64Key, nonce),
  };
}
