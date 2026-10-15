import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import {
  ChargesPutBody,
  ChargesPutParams,
} from '../../client/generated/v4/charges-update.zod.js';
import { v4JsonResult } from './httpResult.js';

export const UpdateChargeSchema = {
  id: z.string().min(1).describe('ID of the charge to update (chg_…).'),
  meta: ChargesPutBody.shape.meta,
  authorization: ChargesPutBody.shape.authorization,
};

export type UpdateChargeArgs = {
  id: string;
  meta?: z.infer<typeof ChargesPutBody>['meta'];
  authorization?: z.infer<typeof ChargesPutBody>['authorization'];
};

export async function updateCharge(args: UpdateChargeArgs) {
  const strict = z.object(UpdateChargeSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Charge update failed tool schema validation: ${strict.error.message}`,
    );
  }

  const { id, ...bodyInput } = strict.data;
  if (bodyInput.meta === undefined && bodyInput.authorization === undefined) {
    throw new Error(
      'Charge update failed tool schema validation: provide meta or authorization',
    );
  }

  const idParsed = ChargesPutParams.safeParse({ id });
  if (!idParsed.success) {
    throw new Error(
      `Charge id failed generated schema validation: ${idParsed.error.message}`,
    );
  }

  const body = ChargesPutBody.safeParse(bodyInput);
  if (!body.success) {
    throw new Error(
      `Charge update body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/charges/${encodeURIComponent(idParsed.data.id)}`,
    { method: 'PUT', body: JSON.stringify(body.data) },
  );
  return v4JsonResult(response, 'update charge');
}
