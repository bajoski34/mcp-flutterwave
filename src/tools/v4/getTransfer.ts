import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { TransferGetParams } from '../../client/generated/v4/transfers-get.zod.js';
import { v4JsonResult } from './httpResult.js';

export const GetTransferSchema = {
  id: z.string().min(1).describe('ID of the transfer.'),
};

export type GetTransferArgs = {
  id: string;
};

export async function getTransfer(args: GetTransferArgs) {
  const strict = z.object(GetTransferSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Transfer id failed tool schema validation: ${strict.error.message}`,
    );
  }

  const parsed = TransferGetParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Transfer id failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/transfers/${encodeURIComponent(parsed.data.id)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'get transfer');
}
