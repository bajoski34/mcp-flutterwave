import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import {
  CustomersSearchBody,
  CustomersSearchQueryParams,
} from '../../client/generated/v4/customers-search.zod.js';
import { toQueryString, v4JsonResult } from './httpResult.js';

export const SearchCustomersSchema = {
  email: z
    .string()
    .email('A valid email is required')
    .describe('Email address to search for.'),
  page: z.number().int().min(1).optional().describe('Page to retrieve.'),
  size: z
    .number()
    .int()
    .min(10)
    .max(50)
    .optional()
    .describe('Page size. Flutterwave requires 10 to 50. Defaults to 10.'),
};

export type SearchCustomersArgs = {
  email: string;
  page?: number;
  size?: number;
};

export async function searchCustomers(args: SearchCustomersArgs) {
  const strict = z.object(SearchCustomersSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Customer search failed tool schema validation: ${strict.error.message}`,
    );
  }

  const body = CustomersSearchBody.safeParse({ email: args.email });
  if (!body.success) {
    throw new Error(
      `Customer search body failed generated schema validation: ${body.error.message}`,
    );
  }

  const query = CustomersSearchQueryParams.safeParse({
    page: args.page,
    size: args.size,
  });
  if (!query.success) {
    throw new Error(
      `Customer search query failed generated schema validation: ${query.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/customers/search${toQueryString(query.data)}`,
    { method: 'POST', body: JSON.stringify(body.data) },
  );
  return v4JsonResult(response, 'search customers');
}
