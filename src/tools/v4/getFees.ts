import { flwV4Fetch } from '../../client/v4/http.js';
import { FeesGetQueryParams } from '../../client/generated/v4/fees.zod.js';
import { toQueryString, v4JsonResult } from './httpResult.js';

export const GetFeesSchema = {
  amount: FeesGetQueryParams.shape.amount,
  currency: FeesGetQueryParams.shape.currency,
  payment_method: FeesGetQueryParams.shape.payment_method,
  card6: FeesGetQueryParams.shape.card6,
  country: FeesGetQueryParams.shape.country,
  network: FeesGetQueryParams.shape.network,
};

export type GetFeesArgs = {
  amount: number;
  currency: string;
  payment_method: string;
  card6?: string;
  country?: string;
  network?: string;
};

export async function getFees(args: GetFeesArgs) {
  const parsed = FeesGetQueryParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Fee query failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(`/fees${toQueryString(parsed.data)}`, {
    method: 'GET',
  });
  return v4JsonResult(response, 'get fees');
}
