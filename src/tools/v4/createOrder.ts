import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { OrdersPostBody } from '../../client/generated/v4/orders.zod.js';
import { v4JsonResult } from './httpResult.js';

export const CreateOrderSchema = {
  amount: OrdersPostBody.shape.amount,
  currency: OrdersPostBody.shape.currency,
  reference: OrdersPostBody.shape.reference,
  customer_id: z.string().min(1).describe('ID of the customer (cus_…).'),
  payment_method_id: z
    .string()
    .min(1)
    .describe('ID of the payment method (pmd_…).'),
  redirect_url: OrdersPostBody.shape.redirect_url,
  meta: OrdersPostBody.shape.meta,
  merchant_vat_amount: OrdersPostBody.shape.merchant_vat_amount,
};

export type CreateOrderArgs = {
  amount: number;
  currency: string;
  reference: string;
  customer_id: string;
  payment_method_id: string;
  redirect_url?: string;
  meta?: Record<string, string>;
  merchant_vat_amount?: number;
};

export async function createOrder(args: CreateOrderArgs) {
  const strict = z.object(CreateOrderSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Order failed tool schema validation: ${strict.error.message}`,
    );
  }

  const body = OrdersPostBody.safeParse(args);
  if (!body.success) {
    throw new Error(
      `Order body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch('/orders', {
    method: 'POST',
    body: JSON.stringify(body.data),
  });
  return v4JsonResult(response, 'create order');
}
