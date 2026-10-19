import { flwV4Fetch } from '../../client/v4/http.js';
import { VirtualAccountsListQueryParams } from '../../client/generated/v4/virtual-accounts-list.zod.js';
import { toQueryString, v4JsonResult } from './httpResult.js';

export const ListVirtualAccountsSchema = {
  to: VirtualAccountsListQueryParams.shape.to,
  from: VirtualAccountsListQueryParams.shape.from,
  page: VirtualAccountsListQueryParams.shape.page,
  size: VirtualAccountsListQueryParams.shape.size,
  reference: VirtualAccountsListQueryParams.shape.reference,
};

export type ListVirtualAccountsArgs = {
  to?: string;
  from?: string;
  page?: number;
  size?: number;
  reference?: string;
};

export async function listVirtualAccounts(args: ListVirtualAccountsArgs) {
  const parsed = VirtualAccountsListQueryParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Virtual account list query failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/virtual-accounts${toQueryString(parsed.data)}`,
    { method: 'GET' },
  );
  return v4JsonResult(response, 'list virtual accounts');
}
