import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import {
  OrdersPutBody,
  OrdersPutParams,
} from '../../client/generated/v4/orders-update.zod.js';
import { v4JsonResult } from './httpResult.js';

export const UpdateOrderSchema = {
  id: z.string().min(1).describe('ID of the order to update (ord_…).'),
  meta: OrdersPutBody.shape.meta,
  action: OrdersPutBody.shape.action,
};

export type UpdateOrderArgs = {
  id: string;
  meta?: Record<string, string>;
  action?: 'void' | 'capture';
};

export async function updateOrder(args: UpdateOrderArgs) {
  const strict = z.object(UpdateOrderSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Order update failed tool schema validation: ${strict.error.message}`,
    );
  }

  const { id, ...bodyInput } = strict.data;
  if (bodyInput.meta === undefined && bodyInput.action === undefined) {
    throw new Error(
      'Order update failed tool schema validation: provide meta or action',
    );
  }

  const idParsed = OrdersPutParams.safeParse({ id });
  if (!idParsed.success) {
    throw new Error(
      `Order id failed generated schema validation: ${idParsed.error.message}`,
    );
  }

  const body = OrdersPutBody.safeParse(bodyInput);
  if (!body.success) {
    throw new Error(
      `Order update body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/orders/${encodeURIComponent(idParsed.data.id)}`,
    { method: 'PUT', body: JSON.stringify(body.data) },
  );
  return v4JsonResult(response, 'update order');
}
