import { flwV4Fetch } from '../../client/v4/http.js';
import { v4JsonResult } from './httpResult.js';

export const ListWalletBalancesSchema = {};

export type ListWalletBalancesArgs = Record<string, never>;

export async function listWalletBalances(_args: ListWalletBalancesArgs) {
  const response = await flwV4Fetch('/wallets/balances', { method: 'GET' });
  return v4JsonResult(response, 'list wallet balances');
}
