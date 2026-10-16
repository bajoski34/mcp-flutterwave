import { flwV4Fetch } from '../../client/v4/http.js';
import { OrdersListQueryParams } from '../../client/generated/v4/orders-list.zod.js';
import { toQueryString, v4JsonResult } from './httpResult.js';

export const ListOrdersSchema = {
  status: OrdersListQueryParams.shape.status,
  to: OrdersListQueryParams.shape.to,
  from: OrdersListQueryParams.shape.from,
  customer_id: OrdersListQueryParams.shape.customer_id,
  payment_method_id: OrdersListQueryParams.shape.payment_method_id,
  page: OrdersListQueryParams.shape.page,
  size: OrdersListQueryParams.shape.size,
};

export type ListOrdersArgs = {
  status?:
    | 'completed'
    | 'pending'
    | 'authorized'
    | 'partially-completed'
    | 'voided'
    | 'failed';
  to?: string;
  from?: string;
  customer_id?: string;
  payment_method_id?: string;
  page?: number;
  size?: number;
};

export async function listOrders(args: ListOrdersArgs) {
  const parsed = OrdersListQueryParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Order list query failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(`/orders${toQueryString(parsed.data)}`, {
    method: 'GET',
  });
  return v4JsonResult(response, 'list orders');
}
