import { flwV4Fetch } from '../../client/v4/http.js';
import { TransfersListQueryParams } from '../../client/generated/v4/transfers-list.zod.js';
import { toQueryString, v4JsonResult } from './httpResult.js';

export const ListTransfersSchema = {
  next: TransfersListQueryParams.shape.next,
  previous: TransfersListQueryParams.shape.previous,
  size: TransfersListQueryParams.shape.size,
  bulk_id: TransfersListQueryParams.shape.bulk_id,
  recipient_id: TransfersListQueryParams.shape.recipient_id,
  sender_id: TransfersListQueryParams.shape.sender_id,
  destination_currency: TransfersListQueryParams.shape.destination_currency,
  source_currency: TransfersListQueryParams.shape.source_currency,
  action: TransfersListQueryParams.shape.action,
  type: TransfersListQueryParams.shape.type,
  status: TransfersListQueryParams.shape.status,
  from: TransfersListQueryParams.shape.from,
  to: TransfersListQueryParams.shape.to,
};

export type ListTransfersArgs = {
  next?: string;
  previous?: string;
  size?: number;
  bulk_id?: string;
  recipient_id?: string;
  sender_id?: string;
  destination_currency?: string;
  source_currency?: string;
  action?: 'instant' | 'deferred' | 'scheduled' | 'retry';
  type?: 'bank' | 'mobile_money' | 'wallet' | 'cash_pickup';
  status?: 'new' | 'pending' | 'failed' | 'successful' | 'cancelled';
  from?: string;
  to?: string;
};

export async function listTransfers(args: ListTransfersArgs) {
  const parsed = TransfersListQueryParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Transfer list query failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/transfers${toQueryString(parsed.data)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'list transfers');
}
