import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { OrdersGetParams } from '../../client/generated/v4/orders-get.zod.js';
import { v4JsonResult } from './httpResult.js';

export const GetOrderSchema = {
  id: z.string().min(1).describe('ID of the order to retrieve.'),
};

export type GetOrderArgs = {
  id: string;
};

export async function getOrder(args: GetOrderArgs) {
  const strict = z.object(GetOrderSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Order id failed tool schema validation: ${strict.error.message}`,
    );
  }

  const parsed = OrdersGetParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Order id failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/orders/${encodeURIComponent(parsed.data.id)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'get order');
}
