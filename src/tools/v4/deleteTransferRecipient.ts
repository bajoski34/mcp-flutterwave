import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { TransfersRecipientsDeleteParams } from '../../client/generated/v4/transfer-recipients-delete.zod.js';
import { v4JsonResult } from './httpResult.js';

export const DeleteTransferRecipientSchema = {
  id: z.string().min(1).describe('ID of the transfer recipient to delete.'),
};

export type DeleteTransferRecipientArgs = {
  id: string;
};

export async function deleteTransferRecipient(args: DeleteTransferRecipientArgs) {
  const strict = z.object(DeleteTransferRecipientSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Transfer recipient id failed tool schema validation: ${strict.error.message}`,
    );
  }

  const parsed = TransfersRecipientsDeleteParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Transfer recipient id failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/transfers/recipients/${encodeURIComponent(parsed.data.id)}`,
    { method: 'DELETE' },
  );
  return v4JsonResult(response, 'delete transfer recipient');
}
