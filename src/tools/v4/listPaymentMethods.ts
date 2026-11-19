import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { PaymentMethodsListQueryParams } from '../../client/generated/v4/payment-methods-list.zod.js';
import { toQueryString, v4JsonResult } from './httpResult.js';

export const ListPaymentMethodsSchema = {
  page: z.number().int().min(1).optional().describe('Page to retrieve.'),
  size: z
    .number()
    .int()
    .min(10)
    .max(50)
    .optional()
    .describe('Page size. Flutterwave requires 10 to 50. Defaults to 10.'),
};

export type ListPaymentMethodsArgs = {
  page?: number;
  size?: number;
};

export async function listPaymentMethods(args: ListPaymentMethodsArgs) {
  const parsed = PaymentMethodsListQueryParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Payment method list query failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/payment-methods${toQueryString(parsed.data)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'list payment methods');
}
