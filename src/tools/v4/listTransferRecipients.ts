import { flwV4Fetch } from '../../client/v4/http.js';
import { TransfersRecipientsListQueryParams } from '../../client/generated/v4/transfer-recipients-list.zod.js';
import { toQueryString, v4JsonResult } from './httpResult.js';

export const ListTransferRecipientsSchema = {
  next: TransfersRecipientsListQueryParams.shape.next,
  previous: TransfersRecipientsListQueryParams.shape.previous,
  size: TransfersRecipientsListQueryParams.shape.size,
};

export type ListTransferRecipientsArgs = {
  next?: string;
  previous?: string;
  size?: number;
};

export async function listTransferRecipients(args: ListTransferRecipientsArgs) {
  const parsed = TransfersRecipientsListQueryParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Transfer recipient list query failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/transfers/recipients${toQueryString(parsed.data)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'list transfer recipients');
}
