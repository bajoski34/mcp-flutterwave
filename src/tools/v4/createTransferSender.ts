import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { TransfersSendersCreateBody } from '../../client/generated/v4/transfer-senders.zod.js';
import { v4JsonResult } from './httpResult.js';

const loose = z.record(z.string(), z.unknown());

export const CreateTransferSenderSchema = {
  type: z
    .string()
    .min(1)
    .describe(
      'Sender type: generic_sender, bank_egp, bank_gbp, bank_eur, or mobile_money_egp.',
    ),
  name: z.object({
    first: z.string().min(1),
    middle: z.string().optional(),
    last: z.string().min(1),
  }),
  phone: loose.optional(),
  email: z.string().optional(),
  address: loose.optional(),
  national_identification: loose.optional(),
  date_of_birth: z
    .string()
    .optional()
    .describe('Date of birth, YYYY-MM-DD. Required for some sender types.'),
};

export type CreateTransferSenderArgs = {
  type: string;
  name: { first: string; middle?: string; last: string };
  phone?: Record<string, unknown>;
  email?: string;
  address?: Record<string, unknown>;
  national_identification?: Record<string, unknown>;
  date_of_birth?: string;
};

export async function createTransferSender(args: CreateTransferSenderArgs) {
  const strict = z.object(CreateTransferSenderSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Transfer sender failed tool schema validation: ${strict.error.message}`,
    );
  }

  const body = TransfersSendersCreateBody.safeParse(args);
  if (!body.success) {
    throw new Error(
      `Transfer sender body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch('/transfers/senders', {
    method: 'POST',
    body: JSON.stringify(body.data),
  });
  return v4JsonResult(response, 'create transfer sender');
}
