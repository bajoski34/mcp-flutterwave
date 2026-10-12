import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { RefundsPostBody } from '../../client/generated/v4/refunds.zod.js';

const REFUND_REASONS = [
  'duplicate',
  'fraudulent',
  'requested_by_customer',
  'expired_uncaptured_charge',
] as const;

export const CreateRefundSchema = {
  charge_id: z.string().min(1).describe('ID of the charge to refund (chg_…).'),
  amount: z
    .number()
    .min(0.01, 'Amount must be at least 0.01')
    .describe('Amount of the refund.'),
  reason: z
    .enum(REFUND_REASONS)
    .describe('Reason for the refund.'),
  meta: z.record(z.string(), z.string()).optional(),
};

export type CreateRefundArgs = {
  charge_id: string;
  amount: number;
  reason: (typeof REFUND_REASONS)[number];
  meta?: Record<string, string>;
};

function withoutUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

export async function createRefund(
  args: CreateRefundArgs,
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const body = withoutUndefined({
    charge_id: args.charge_id,
    amount: args.amount,
    reason: args.reason,
    meta: args.meta,
  });

  const parsed = RefundsPostBody.safeParse(body);
  if (!parsed.success) {
    throw new Error(
      `Refund payload failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch('/refunds', {
    method: 'POST',
    body: JSON.stringify(parsed.data),
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(
      `Flutterwave v4 refund request failed: ${response.status} ${raw}`,
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
