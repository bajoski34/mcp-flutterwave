import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { TransfersSendersDeleteParams } from '../../client/generated/v4/transfer-senders-delete.zod.js';
import { v4JsonResult } from './httpResult.js';

export const DeleteTransferSenderSchema = {
  id: z.string().min(1).describe('ID of the transfer sender to delete.'),
};

export type DeleteTransferSenderArgs = {
  id: string;
};

export async function deleteTransferSender(args: DeleteTransferSenderArgs) {
  const strict = z.object(DeleteTransferSenderSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Transfer sender id failed tool schema validation: ${strict.error.message}`,
    );
  }

  const parsed = TransfersSendersDeleteParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Transfer sender id failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/transfers/senders/${encodeURIComponent(parsed.data.id)}`,
    { method: 'DELETE' },
  );
  return v4JsonResult(response, 'delete transfer sender');
}
