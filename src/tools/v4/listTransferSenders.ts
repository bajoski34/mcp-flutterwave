import { flwV4Fetch } from '../../client/v4/http.js';
import { TransfersSendersListQueryParams } from '../../client/generated/v4/transfer-senders-list.zod.js';
import { toQueryString, v4JsonResult } from './httpResult.js';

export const ListTransferSendersSchema = {
  next: TransfersSendersListQueryParams.shape.next,
  previous: TransfersSendersListQueryParams.shape.previous,
  size: TransfersSendersListQueryParams.shape.size,
};

export type ListTransferSendersArgs = {
  next?: string;
  previous?: string;
  size?: number;
};

export async function listTransferSenders(args: ListTransferSendersArgs) {
  const parsed = TransfersSendersListQueryParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Transfer sender list query failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/transfers/senders${toQueryString(parsed.data)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'list transfer senders');
}
