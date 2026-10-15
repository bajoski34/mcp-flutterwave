import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import {
  ChargebackPutBody,
  ChargebackPutParams,
} from '../../client/generated/v4/chargebacks-update.zod.js';
import { v4JsonResult } from './httpResult.js';

export const UpdateChargebackSchema = {
  id: z.string().min(1).describe('ID of the chargeback to update.'),
  status: ChargebackPutBody.shape.status,
  uploaded_proof: ChargebackPutBody.shape.uploaded_proof,
  comment: ChargebackPutBody.shape.comment,
  provider: ChargebackPutBody.shape.provider,
  arn: ChargebackPutBody.shape.arn,
  due_datetime: ChargebackPutBody.shape.due_datetime,
  proof_data: ChargebackPutBody.shape.proof_data,
  amount: ChargebackPutBody.shape.amount,
};

export type UpdateChargebackArgs = {
  id: string;
  status?: 'accepted' | 'declined' | 'partially-accepted';
  uploaded_proof?: string;
  comment?: string;
  provider?: string;
  arn?: string;
  due_datetime?: string;
  proof_data?: string;
  amount?: number;
};

export async function updateChargeback(args: UpdateChargebackArgs) {
  const strict = z.object(UpdateChargebackSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Chargeback update failed tool schema validation: ${strict.error.message}`,
    );
  }

  const { id, ...bodyInput } = strict.data;
  if (Object.values(bodyInput).every((value) => value === undefined)) {
    throw new Error(
      'Chargeback update failed tool schema validation: provide at least one field to update',
    );
  }

  const idParsed = ChargebackPutParams.safeParse({ id });
  if (!idParsed.success) {
    throw new Error(
      `Chargeback id failed generated schema validation: ${idParsed.error.message}`,
    );
  }

  const body = ChargebackPutBody.safeParse(bodyInput);
  if (!body.success) {
    throw new Error(
      `Chargeback update body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/chargebacks/${encodeURIComponent(idParsed.data.id)}`,
    { method: 'PUT', body: JSON.stringify(body.data) },
  );
  return v4JsonResult(response, 'update chargeback');
}
