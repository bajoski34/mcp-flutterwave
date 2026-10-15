import { flwV4Fetch } from '../../client/v4/http.js';
import { BanksGetQueryParams } from '../../client/generated/v4/banks.zod.js';
import { toQueryString, v4JsonResult } from './httpResult.js';

export const GetBanksSchema = {
  country: BanksGetQueryParams.shape.country,
};

export type GetBanksArgs = {
  country: string;
};

export async function getBanks(args: GetBanksArgs) {
  const parsed = BanksGetQueryParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Bank query failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(`/banks${toQueryString(parsed.data)}`, {
    method: 'GET',
  });
  return v4JsonResult(response, 'get banks');
}
