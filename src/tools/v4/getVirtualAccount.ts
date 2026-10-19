import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { VirtualAccountGetParams } from '../../client/generated/v4/virtual-accounts-get.zod.js';
import { v4JsonResult } from './httpResult.js';

export const GetVirtualAccountSchema = {
  id: z.string().min(1).describe('ID of the virtual account to retrieve.'),
};

export type GetVirtualAccountArgs = {
  id: string;
};

export async function getVirtualAccount(args: GetVirtualAccountArgs) {
  const strict = z.object(GetVirtualAccountSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Virtual account id failed tool schema validation: ${strict.error.message}`,
    );
  }

  const parsed = VirtualAccountGetParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Virtual account id failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/virtual-accounts/${encodeURIComponent(parsed.data.id)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'get virtual account');
}
