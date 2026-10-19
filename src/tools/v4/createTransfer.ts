import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { TransfersPostBody } from '../../client/generated/v4/transfers.zod.js';
import { v4JsonResult } from './httpResult.js';

const instruction = TransfersPostBody.shape.payment_instruction;

export const CreateTransferSchema = {
  action: TransfersPostBody.shape.action,
  reference: TransfersPostBody.shape.reference,
  narration: TransfersPostBody.shape.narration,
  disburse_option: TransfersPostBody.shape.disburse_option,
  callback_url: TransfersPostBody.shape.callback_url,
  meta: TransfersPostBody.shape.meta,
  payment_instruction: z.object({
    source_currency: instruction.shape.source_currency,
    amount: instruction.shape.amount,
    recipient_id: z
      .string()
      .min(1)
      .describe('The ID of the recipient receiving the payment.'),
    sender_id: z.string().min(1).optional().describe('The ID of the sender.'),
  }),
};

export type CreateTransferArgs = {
  action: 'instant' | 'deferred' | 'scheduled';
  reference?: string;
  narration?: string;
  disburse_option?: { date_time?: string; timezone?: string };
  callback_url?: string;
  meta?: Record<string, string>;
  payment_instruction: {
    source_currency: string;
    amount: { value: number; applies_to: 'destination_currency' | 'source_currency' };
    recipient_id: string;
    sender_id?: string;
  };
};

export async function createTransfer(args: CreateTransferArgs) {
  const strict = z.object(CreateTransferSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Transfer failed tool schema validation: ${strict.error.message}`,
    );
  }

  if (strict.data.action === 'scheduled' && !strict.data.disburse_option) {
    throw new Error(
      'Transfer failed tool schema validation: disburse_option is required when action is scheduled',
    );
  }

  const body = TransfersPostBody.safeParse(args);
  if (!body.success) {
    throw new Error(
      `Transfer body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch('/transfers', {
    method: 'POST',
    body: JSON.stringify(body.data),
  });
  return v4JsonResult(response, 'create transfer');
}
