import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { SettlementListQueryParams } from '../../client/generated/v4/settlements-list.zod.js';
import { toQueryString, v4JsonResult } from './httpResult.js';

export const ListSettlementsSchema = {
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

export type ListSettlementsArgs = {
  page?: number;
  size?: number;
  from?: string;
  to?: string;
};

export async function listSettlements(args: ListSettlementsArgs) {
  const parsed = SettlementListQueryParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Settlement list query failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/settlements${toQueryString(parsed.data)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'list settlements');
}
