import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { RefundsListQueryParams } from '../../client/generated/v4/refunds-list.zod.js';
import { toQueryString, v4JsonResult } from './httpResult.js';

export const ListRefundsSchema = {
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

export type ListRefundsArgs = z.infer<z.ZodObject<typeof ListRefundsSchema>>;

export async function listRefunds(args: ListRefundsArgs) {
  const parsed = RefundsListQueryParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Refund list query failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(`/refunds${toQueryString(parsed.data)}`, {
    method: 'GET',
  });
  return v4JsonResult(response, 'list refunds');
}
