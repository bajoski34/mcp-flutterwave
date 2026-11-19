import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { ChargebacksGetByIdParams } from '../../client/generated/v4/chargebacks-get.zod.js';
import { v4JsonResult } from './httpResult.js';

export const GetChargebackSchema = {
  id: z.string().min(1).describe('ID of the chargeback to retrieve.'),
};

export type GetChargebackArgs = {
  id: string;
};

export async function getChargeback(args: GetChargebackArgs) {
  const strict = z.object(GetChargebackSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Chargeback id failed tool schema validation: ${strict.error.message}`,
    );
  }

  const parsed = ChargebacksGetByIdParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Chargeback id failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/chargebacks/${encodeURIComponent(parsed.data.id)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'get chargeback');
}
