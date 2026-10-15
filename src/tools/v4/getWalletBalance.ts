import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { FetchCurrencyWalletBalanceParams } from '../../client/generated/v4/wallet-balance.zod.js';
import { v4JsonResult } from './httpResult.js';

export const GetWalletBalanceSchema = {
  currency: z
    .string()
    .min(1)
    .describe('ISO currency code whose balance to fetch, such as NGN.'),
};

export type GetWalletBalanceArgs = {
  currency: string;
};

export async function getWalletBalance(args: GetWalletBalanceArgs) {
  const strict = z.object(GetWalletBalanceSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Wallet balance failed tool schema validation: ${strict.error.message}`,
    );
  }

  const parsed = FetchCurrencyWalletBalanceParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Wallet balance currency failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/wallets/balances/${encodeURIComponent(parsed.data.currency)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'get wallet balance');
}
