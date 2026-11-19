import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { TransfersRecipientsGetParams } from '../../client/generated/v4/transfer-recipients-get.zod.js';
import { v4JsonResult } from './httpResult.js';

export const GetTransferRecipientSchema = {
  id: z.string().min(1).describe('ID of the transfer recipient.'),
};

export type GetTransferRecipientArgs = {
  id: string;
};

export async function getTransferRecipient(args: GetTransferRecipientArgs) {
  const strict = z.object(GetTransferRecipientSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Transfer recipient id failed tool schema validation: ${strict.error.message}`,
    );
  }

  const parsed = TransfersRecipientsGetParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Transfer recipient id failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/transfers/recipients/${encodeURIComponent(parsed.data.id)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'get transfer recipient');
}
