import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { TransferRatesPostBody } from '../../client/generated/v4/transfer-rates.zod.js';
import { v4JsonResult } from './httpResult.js';

export const QuoteTransferRateSchema = {
  source: TransferRatesPostBody.shape.source,
  destination: TransferRatesPostBody.shape.destination,
  precision: TransferRatesPostBody.shape.precision,
};

export type QuoteTransferRateArgs = {
  source: { currency: string };
  destination: { currency: string; amount: number };
  precision?: number;
};

export async function quoteTransferRate(args: QuoteTransferRateArgs) {
  const strict = z.object(QuoteTransferRateSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Transfer rate failed tool schema validation: ${strict.error.message}`,
    );
  }

  const body = TransferRatesPostBody.safeParse(args);
  if (!body.success) {
    throw new Error(
      `Transfer rate body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch('/transfers/rates', {
    method: 'POST',
    body: JSON.stringify(body.data),
  });
  return v4JsonResult(response, 'quote transfer rate');
}
