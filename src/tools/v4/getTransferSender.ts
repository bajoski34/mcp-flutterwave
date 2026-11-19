import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { TransfersSendersGetParams } from '../../client/generated/v4/transfer-senders-get.zod.js';
import { v4JsonResult } from './httpResult.js';

export const GetTransferSenderSchema = {
  id: z.string().min(1).describe('ID of the transfer sender.'),
};

export type GetTransferSenderArgs = {
  id: string;
};

export async function getTransferSender(args: GetTransferSenderArgs) {
  const strict = z.object(GetTransferSenderSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Transfer sender id failed tool schema validation: ${strict.error.message}`,
    );
  }

  const parsed = TransfersSendersGetParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Transfer sender id failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/transfers/senders/${encodeURIComponent(parsed.data.id)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'get transfer sender');
}
