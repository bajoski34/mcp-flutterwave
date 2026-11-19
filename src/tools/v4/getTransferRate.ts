import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { TransferRatesGetParams } from '../../client/generated/v4/transfer-rates-get.zod.js';
import { v4JsonResult } from './httpResult.js';

export const GetTransferRateSchema = {
  id: z.string().min(1).describe('ID of the quoted transfer rate.'),
};

export type GetTransferRateArgs = {
  id: string;
};

export async function getTransferRate(args: GetTransferRateArgs) {
  const strict = z.object(GetTransferRateSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Transfer rate id failed tool schema validation: ${strict.error.message}`,
    );
  }

  const parsed = TransferRatesGetParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Transfer rate id failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/transfers/rates/${encodeURIComponent(parsed.data.id)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'get transfer rate');
}
