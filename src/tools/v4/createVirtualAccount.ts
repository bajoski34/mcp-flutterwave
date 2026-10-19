import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { VirtualAccountsPostBody } from '../../client/generated/v4/virtual-accounts.zod.js';
import { v4JsonResult } from './httpResult.js';

export const CreateVirtualAccountSchema = {
  customer_id: z.string().min(1).describe('ID of the customer (cus_…).'),
  reference: VirtualAccountsPostBody.shape.reference,
  currency: VirtualAccountsPostBody.shape.currency,
  account_type: VirtualAccountsPostBody.shape.account_type,
  amount: VirtualAccountsPostBody.shape.amount,
  expiry: VirtualAccountsPostBody.shape.expiry,
  narration: VirtualAccountsPostBody.shape.narration,
  bvn: VirtualAccountsPostBody.shape.bvn,
  nin: VirtualAccountsPostBody.shape.nin,
  customer_account_number: VirtualAccountsPostBody.shape.customer_account_number,
  bank_code: VirtualAccountsPostBody.shape.bank_code,
  meta: VirtualAccountsPostBody.shape.meta,
  merchant_vat_amount: VirtualAccountsPostBody.shape.merchant_vat_amount,
};

export type CreateVirtualAccountArgs = {
  customer_id: string;
  reference: string;
  currency: 'NGN' | 'GHS' | 'EGP' | 'KES' | 'MAD' | 'ZAR';
  account_type: 'static' | 'dynamic';
  amount?: number;
  expiry?: number;
  narration?: string;
  bvn?: string;
  nin?: string;
  customer_account_number?: string;
  bank_code?: string;
  meta?: Record<string, string>;
  merchant_vat_amount?: number;
};

export async function createVirtualAccount(args: CreateVirtualAccountArgs) {
  const strict = z.object(CreateVirtualAccountSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Virtual account failed tool schema validation: ${strict.error.message}`,
    );
  }

  const body = VirtualAccountsPostBody.safeParse(args);
  if (!body.success) {
    throw new Error(
      `Virtual account body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch('/virtual-accounts', {
    method: 'POST',
    body: JSON.stringify(body.data),
  });
  return v4JsonResult(response, 'create virtual account');
}
