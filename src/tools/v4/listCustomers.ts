import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { CustomersListQueryParams } from '../../client/generated/v4/customers-list.zod.js';
import { toQueryString, v4JsonResult } from './httpResult.js';

export const ListCustomersSchema = {
  page: z
    .number()
    .int()
    .min(1)
    .optional()
    .describe('Page to retrieve. The most recent customers are on page 1.'),
  size: z
    .number()
    .int()
    .min(10)
    .max(50)
    .optional()
    .describe('Page size. Flutterwave requires 10 to 50. Defaults to 10.'),
};

export type ListCustomersArgs = {
  page?: number;
  size?: number;
};

export async function listCustomers(args: ListCustomersArgs) {
  const parsed = CustomersListQueryParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Customer list query failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/customers${toQueryString(parsed.data)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'list customers');
}
