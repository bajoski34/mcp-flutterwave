import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import {
  SettlementGetParams,
  SettlementGetQueryParams,
} from '../../client/generated/v4/settlements-get.zod.js';
import { toQueryString, v4JsonResult } from './httpResult.js';

export const GetSettlementSchema = {
  id: z.string().min(1).describe('ID of the settlement to retrieve.'),
  page: z.number().int().min(1).optional().describe('Page of settlement lines.'),
  size: z
    .number()
    .int()
    .min(10)
    .max(50)
    .optional()
    .describe('Page size. Flutterwave requires 10 to 50. Defaults to 10.'),
};

export type GetSettlementArgs = {
  id: string;
  page?: number;
  size?: number;
};

export async function getSettlement(args: GetSettlementArgs) {
  const strict = z.object(GetSettlementSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Settlement id failed tool schema validation: ${strict.error.message}`,
    );
  }

  const id = SettlementGetParams.safeParse({ id: args.id });
  if (!id.success) {
    throw new Error(
      `Settlement id failed generated schema validation: ${id.error.message}`,
    );
  }

  const query = SettlementGetQueryParams.safeParse({
    page: args.page,
    size: args.size,
  });
  if (!query.success) {
    throw new Error(
      `Settlement query failed generated schema validation: ${query.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/settlements/${encodeURIComponent(id.data.id)}${toQueryString(query.data)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'get settlement');
}
