import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { TransfersRecipientsCreateBody } from '../../client/generated/v4/transfer-recipients.zod.js';
import { v4JsonResult } from './httpResult.js';

const loose = z.record(z.string(), z.unknown());

export const CreateTransferRecipientSchema = {
  type: z
    .string()
    .min(1)
    .describe('Recipient type, for example bank_ngn or mobile_money_ghs.'),
  destination_currency: z.string().min(1).optional(),
  name: z
    .object({
      first: z.string().optional(),
      middle: z.string().optional(),
      last: z.string().optional(),
    })
    .optional(),
  bank: z
    .object({
      account_number: z.string().min(1),
      code: z.string().min(1),
    })
    .passthrough()
    .optional(),
  mobile_money: loose.optional(),
  phone: loose.optional(),
  email: z.string().optional(),
  address: loose.optional(),
  national_identification: loose.optional(),
};

export type CreateTransferRecipientArgs = {
  type: string;
  destination_currency?: string;
  name?: { first?: string; middle?: string; last?: string };
  bank?: { account_number: string; code: string };
  mobile_money?: Record<string, unknown>;
  phone?: Record<string, unknown>;
  email?: string;
  address?: Record<string, unknown>;
  national_identification?: Record<string, unknown>;
};

export async function createTransferRecipient(args: CreateTransferRecipientArgs) {
  const strict = z.object(CreateTransferRecipientSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Transfer recipient failed tool schema validation: ${strict.error.message}`,
    );
  }

  const body = TransfersRecipientsCreateBody.safeParse(args);
  if (!body.success) {
    throw new Error(
      `Transfer recipient body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch('/transfers/recipients', {
    method: 'POST',
    body: JSON.stringify(body.data),
  });
  return v4JsonResult(response, 'create transfer recipient');
}
