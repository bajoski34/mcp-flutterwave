import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { ChargebacksListQueryParams } from '../../client/generated/v4/chargebacks-list.zod.js';
import { toQueryString, v4JsonResult } from './httpResult.js';

export const ListChargebacksSchema = {
  page: z.number().int().min(1).optional().describe('Page to retrieve.'),
  size: z
    .number()
    .int()
    .min(10)
    .max(50)
    .optional()
    .describe('Page size. Flutterwave requires 10 to 50. Defaults to 10.'),
  from: z
    .string()
    .optional()
    .describe('Range start, ISO 8601 date-time with offset.'),
  to: z
    .string()
    .optional()
    .describe('Range end, ISO 8601 date-time with offset.'),
};

export type ListChargebacksArgs = {
  page?: number;
  size?: number;
  from?: string;
  to?: string;
};

export async function listChargebacks(args: ListChargebacksArgs) {
  const parsed = ChargebacksListQueryParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Chargeback list query failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/chargebacks${toQueryString(parsed.data)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'list chargebacks');
}
