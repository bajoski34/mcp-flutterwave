import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { ChargesPostBody } from '../../client/generated/v4/charge.zod.js';

export const CreateChargeSchema = {
  amount: z
    .number()
    .min(0.01, 'Amount must be at least 0.01')
    .describe('The payment amount in decimals.'),
  currency: z
    .string()
    .regex(/^[A-Z]{3,5}$/, 'Currency must be an ISO 4217 code')
    .describe('ISO 4217 currency code.'),
  reference: z
    .string()
    .min(6)
    .max(42)
    .regex(
      /^[a-zA-Z0-9-]+$/,
      'Reference must be 6-42 alphanumeric characters or hyphens',
    )
    .describe('A unique custom identifier for this charge.'),
  customer_id: z.string().min(1).describe('ID of the customer (cus_…).'),
  payment_method_id: z
    .string()
    .min(1)
    .describe('ID of the payment method (pmd_…).'),
  redirect_url: z.string().url().optional(),
  meta: z.record(z.string(), z.string()).optional(),
};

export type CreateChargeArgs = {
  amount: number;
  currency: string;
  reference: string;
  customer_id: string;
  payment_method_id: string;
  redirect_url?: string;
  meta?: Record<string, string>;
};

function withoutUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

export async function createCharge(
  args: CreateChargeArgs,
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const body = withoutUndefined({
    amount: args.amount,
    currency: args.currency,
    reference: args.reference,
    customer_id: args.customer_id,
    payment_method_id: args.payment_method_id,
    redirect_url: args.redirect_url,
    meta: args.meta,
  });

  const parsed = ChargesPostBody.safeParse(body);
  if (!parsed.success) {
    throw new Error(
      `Charge payload failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch('/charges', {
    method: 'POST',
    body: JSON.stringify(parsed.data),
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(
      `Flutterwave v4 charge request failed: ${response.status} ${raw}`,
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
