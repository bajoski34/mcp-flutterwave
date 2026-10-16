import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import {
  TransferPutBody,
  TransferPutParams,
} from '../../client/generated/v4/transfers-update.zod.js';
import { v4JsonResult } from './httpResult.js';

export const UpdateTransferSchema = {
  id: z.string().min(1).describe('ID of the deferred or scheduled transfer.'),
  initiate: TransferPutBody.shape.initiate,
  close: TransferPutBody.shape.close,
  disburse_option: TransferPutBody.shape.disburse_option,
};

export type UpdateTransferArgs = {
  id: string;
  initiate?: boolean;
  close?: boolean;
  disburse_option?: { date_time?: string; timezone?: string };
};

export async function updateTransfer(args: UpdateTransferArgs) {
  const strict = z.object(UpdateTransferSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Transfer update failed tool schema validation: ${strict.error.message}`,
    );
  }

  const { id, ...bodyInput } = strict.data;
  if (
    bodyInput.initiate === undefined &&
    bodyInput.close === undefined &&
    bodyInput.disburse_option === undefined
  ) {
    throw new Error(
      'Transfer update failed tool schema validation: provide initiate, close, or disburse_option',
    );
  }

  const idParsed = TransferPutParams.safeParse({ id });
  if (!idParsed.success) {
    throw new Error(
      `Transfer id failed generated schema validation: ${idParsed.error.message}`,
    );
  }

  const body = TransferPutBody.safeParse(bodyInput);
  if (!body.success) {
    throw new Error(
      `Transfer update body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/transfers/${encodeURIComponent(idParsed.data.id)}`,
    { method: 'PUT', body: JSON.stringify(body.data) },
  );
  return v4JsonResult(response, 'update transfer');
}
