import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { BankAccountResolvePostBody } from '../../client/generated/v4/bank-account-resolve.zod.js';
import { v4JsonResult } from './httpResult.js';

export const ResolveBankAccountSchema = {
  currency: z
    .enum(['NGN', 'GBP', 'USD', 'GHS', 'UGX'])
    .describe('Currency of the account to resolve.'),
  account: z
    .record(z.string(), z.unknown())
    .describe(
      'Account details for that currency. NGN requires code (digits) and number (10 digits).',
    ),
};

export type ResolveBankAccountArgs = {
  currency: 'NGN' | 'GBP' | 'USD' | 'GHS' | 'UGX';
  account: Record<string, unknown>;
};

export async function resolveBankAccount(args: ResolveBankAccountArgs) {
  const strict = z.object(ResolveBankAccountSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Bank account resolve failed tool schema validation: ${strict.error.message}`,
    );
  }

  const body = BankAccountResolvePostBody.safeParse(args);
  if (!body.success) {
    throw new Error(
      `Bank account resolve body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch('/banks/account-resolve', {
    method: 'POST',
    body: JSON.stringify(body.data),
  });
  return v4JsonResult(response, 'resolve bank account');
}
