import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import {
  TransferPostRetryBody,
  TransferPostRetryParams,
} from '../../client/generated/v4/transfers-retry.zod.js';
import { v4JsonResult } from './httpResult.js';

export const RetryTransferSchema = {
  id: z.string().min(1).describe('ID of the transfer to retry or duplicate.'),
  action: TransferPostRetryBody.shape.action,
  reference: TransferPostRetryBody.shape.reference,
  meta: TransferPostRetryBody.shape.meta,
  callback_url: TransferPostRetryBody.shape.callback_url,
};

export type RetryTransferArgs = {
  id: string;
  action: 'retry' | 'duplicate';
  reference?: string;
  meta?: Record<string, string>;
  callback_url?: string;
};

export async function retryTransfer(args: RetryTransferArgs) {
  const strict = z.object(RetryTransferSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Transfer retry failed tool schema validation: ${strict.error.message}`,
    );
  }

  const { id, ...bodyInput } = strict.data;
  const idParsed = TransferPostRetryParams.safeParse({ id });
  if (!idParsed.success) {
    throw new Error(
      `Transfer id failed generated schema validation: ${idParsed.error.message}`,
    );
  }

  const body = TransferPostRetryBody.safeParse(bodyInput);
  if (!body.success) {
    throw new Error(
      `Transfer retry body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/transfers/${encodeURIComponent(idParsed.data.id)}/retries`,
    { method: 'POST', body: JSON.stringify(body.data) },
  );
  return v4JsonResult(response, 'retry transfer');
}
