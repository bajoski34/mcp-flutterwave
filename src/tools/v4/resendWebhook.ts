import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { ResendWebhookBody } from '../../client/generated/v4/resend-webhook.zod.js';
import { v4JsonResult } from './httpResult.js';

export const ResendWebhookSchema = {
  id: z
    .string()
    .min(1)
    .describe(
      'Entity id (chg_, ord_, trf_) or webhook message id (wbk_) to resend.',
    ),
  type: ResendWebhookBody.shape.type,
};

export type ResendWebhookArgs = {
  id: string;
  type:
    | 'charge.completed'
    | 'transfer.disburse'
    | 'transfer.reversal'
    | 'order.authorization';
};

export async function resendWebhook(args: ResendWebhookArgs) {
  const strict = z.object(ResendWebhookSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Resend webhook failed tool schema validation: ${strict.error.message}`,
    );
  }

  const body = ResendWebhookBody.safeParse(args);
  if (!body.success) {
    throw new Error(
      `Resend webhook body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch('/resend-webhook', {
    method: 'POST',
    body: JSON.stringify(body.data),
  });
  return v4JsonResult(response, 'resend webhook');
}
