import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import {
  VirtualAccountsPutBody,
  VirtualAccountsPutParams,
} from '../../client/generated/v4/virtual-accounts-update.zod.js';
import { v4JsonResult } from './httpResult.js';

export const UpdateVirtualAccountSchema = {
  id: z.string().min(1).describe('ID of the virtual account (van_…).'),
  action_type: VirtualAccountsPutBody.shape.action_type,
  status: VirtualAccountsPutBody.shape.status,
  bvn: VirtualAccountsPutBody.shape.bvn,
  meta: VirtualAccountsPutBody.shape.meta,
};

export type UpdateVirtualAccountArgs = {
  id: string;
  action_type: 'update_bvn' | 'update_status';
  status?: 'inactive';
  bvn?: string;
  meta?: Record<string, string>;
};

export async function updateVirtualAccount(args: UpdateVirtualAccountArgs) {
  const strict = z.object(UpdateVirtualAccountSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Virtual account update failed tool schema validation: ${strict.error.message}`,
    );
  }

  if (strict.data.action_type === 'update_status' && !strict.data.status) {
    throw new Error(
      'Virtual account update failed tool schema validation: status is required when action_type is update_status',
    );
  }
  if (strict.data.action_type === 'update_bvn' && !strict.data.bvn) {
    throw new Error(
      'Virtual account update failed tool schema validation: bvn is required when action_type is update_bvn',
    );
  }

  const { id, ...bodyInput } = strict.data;
  const idParsed = VirtualAccountsPutParams.safeParse({ id });
  if (!idParsed.success) {
    throw new Error(
      `Virtual account id failed generated schema validation: ${idParsed.error.message}`,
    );
  }

  const body = VirtualAccountsPutBody.safeParse(bodyInput);
  if (!body.success) {
    throw new Error(
      `Virtual account update body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/virtual-accounts/${encodeURIComponent(idParsed.data.id)}`,
    { method: 'PUT', body: JSON.stringify(body.data) },
  );
  return v4JsonResult(response, 'update virtual account');
}
