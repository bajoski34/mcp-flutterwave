import { flwV4Fetch } from '../../client/v4/http.js';
import { ChargebacksPostBody } from '../../client/generated/v4/chargebacks.zod.js';
import { v4JsonResult } from './httpResult.js';

export const CreateChargebackSchema = {
  charge_id: ChargebacksPostBody.shape.charge_id,
  amount: ChargebacksPostBody.shape.amount,
  type: ChargebacksPostBody.shape.type,
  expiry: ChargebacksPostBody.shape.expiry,
  stage: ChargebacksPostBody.shape.stage,
  status: ChargebacksPostBody.shape.status,
  uploaded_proof: ChargebacksPostBody.shape.uploaded_proof,
  comment: ChargebacksPostBody.shape.comment,
  provider: ChargebacksPostBody.shape.provider,
  arn: ChargebacksPostBody.shape.arn,
  initiator: ChargebacksPostBody.shape.initiator,
};

export type CreateChargebackArgs = {
  charge_id: string;
  amount: number;
  type: 'local' | 'international';
  expiry: number;
  stage?: 'new' | 'second' | 'pre-arbitration' | 'arbitration';
  status?: 'pending' | 'initiated';
  uploaded_proof?: string;
  comment?: string;
  provider?: string;
  arn?: string;
  initiator?: string;
};

export async function createChargeback(args: CreateChargebackArgs) {
  const body = ChargebacksPostBody.safeParse(args);
  if (!body.success) {
    throw new Error(
      `Chargeback body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch('/chargebacks', {
    method: 'POST',
    body: JSON.stringify(body.data),
  });
  return v4JsonResult(response, 'create chargeback');
}
