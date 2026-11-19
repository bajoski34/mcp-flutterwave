import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { encryptCardFields } from '../../client/v4/encryption.js';
import { PaymentMethodsPostBody } from '../../client/generated/v4/payment-methods.zod.js';
import { config } from '../../config/index.js';

export const CreateCardPaymentMethodSchema = {
  card_number: z
    .string()
    .regex(/^\d{12,19}$/, 'Card number must be 12 to 19 digits'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  expiry_month: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, 'Expiry month must be 01-12'),
  expiry_year: z
    .string()
    .regex(/^\d{2}$/, 'Expiry year must be 2 digits, for example 32'),
  card_holder_name: z.string().min(1).optional(),
  customer_id: z.string().min(1).optional(),
  billing_address: z
    .object({
      city: z.string().min(1),
      country: z.string().regex(/^[A-Z]{2}$/, 'Country must be an ISO2 code'),
      line1: z.string().min(1),
      line2: z.string().min(1).optional(),
      postal_code: z.string().min(1),
      state: z.string().min(1),
    })
    .optional(),
};

export type CreateCardPaymentMethodArgs = {
  card_number: string;
  cvv: string;
  expiry_month: string;
  expiry_year: string;
  card_holder_name?: string;
  customer_id?: string;
  billing_address?: {
    city: string;
    country: string;
    line1: string;
    line2?: string;
    postal_code: string;
    state: string;
  };
};

function withoutUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

export async function createCardPaymentMethod(
  args: CreateCardPaymentMethodArgs,
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const encryptionKey = config.flutterwave.encryptionKeyV4;
  if (!encryptionKey) {
    throw new Error(
      'FLW_ENCRYPTION_KEY_V4 is required to create a v4 card payment method',
    );
  }

  const encrypted = encryptCardFields(
    {
      cardNumber: args.card_number,
      cvv: args.cvv,
      expiryMonth: args.expiry_month,
      expiryYear: args.expiry_year,
    },
    encryptionKey,
  );

  const body = withoutUndefined({
    type: 'card' as const,
    customer_id: args.customer_id,
    card: withoutUndefined({
      nonce: encrypted.nonce,
      encrypted_card_number: encrypted.encrypted_card_number,
      encrypted_cvv: encrypted.encrypted_cvv,
      encrypted_expiry_month: encrypted.encrypted_expiry_month,
      encrypted_expiry_year: encrypted.encrypted_expiry_year,
      card_holder_name: args.card_holder_name,
      billing_address: args.billing_address,
    }),
  });

  const parsed = PaymentMethodsPostBody.safeParse(body);
  if (!parsed.success) {
    throw new Error(
      `Payment method payload failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch('/payment-methods', {
    method: 'POST',
    body: JSON.stringify(parsed.data),
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(
      `Flutterwave v4 payment method request failed: ${response.status} ${raw}`,
    );
  }

  let payload: unknown = raw;
  try {
    payload = raw === '' ? null : JSON.parse(raw);
  } catch {
    payload = raw;
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          { status: response.status, body: payload },
          null,
          2,
        ),
      },
    ],
  };
}
