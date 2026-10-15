import { flwV4Fetch } from '../../client/v4/http.js';
import { MobileNetworksGetQueryParams } from '../../client/generated/v4/mobile-networks.zod.js';
import { toQueryString, v4JsonResult } from './httpResult.js';

export const GetMobileNetworksSchema = {
  country: MobileNetworksGetQueryParams.shape.country,
};

export type GetMobileNetworksArgs = {
  country: string;
};

export async function getMobileNetworks(args: GetMobileNetworksArgs) {
  const parsed = MobileNetworksGetQueryParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Mobile network query failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/mobile-networks${toQueryString(parsed.data)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'get mobile networks');
}
