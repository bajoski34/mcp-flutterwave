import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { GetWalletStatementQueryParams } from '../../client/generated/v4/wallet-statement.zod.js';
import { toQueryString, v4JsonResult } from './httpResult.js';

export const GetWalletStatementSchema = {
  currency: GetWalletStatementQueryParams.shape.currency,
  from: z
    .string()
    .optional()
    .describe('Range start, ISO 8601 date-time.'),
  to: z.string().optional().describe('Range end, ISO 8601 date-time.'),
  size: z
    .number()
    .int()
    .min(10)
    .max(50)
    .optional()
    .describe('Page size. Flutterwave requires 10 to 50. Defaults to 10.'),
  next: z.string().min(1).optional().describe('Cursor for the next page.'),
  previous: z
    .string()
    .min(1)
    .optional()
    .describe('Cursor for the previous page.'),
};

export type GetWalletStatementArgs = {
  currency: z.infer<typeof GetWalletStatementQueryParams>['currency'];
  from?: string;
  to?: string;
  size?: number;
  next?: string;
  previous?: string;
};

export async function getWalletStatement(args: GetWalletStatementArgs) {
  const parsed = GetWalletStatementQueryParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Wallet statement query failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/wallets/statement${toQueryString(parsed.data)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'get wallet statement');
}
