import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { WalletAccountResolvePostBody } from '../../client/generated/v4/wallet-lookup.zod.js';
import { v4JsonResult } from './httpResult.js';

export const ResolveWalletAccountSchema = {
  provider: WalletAccountResolvePostBody.shape.provider,
  identifier: z
    .string()
    .min(1)
    .describe(
      'Identifier assigned to the merchant by the provider. For Flutterwave this is the wallet account identifier.',
    ),
};

export type ResolveWalletAccountArgs = {
  provider: 'flutterwave';
  identifier: string;
};

export async function resolveWalletAccount(args: ResolveWalletAccountArgs) {
  const strict = z.object(ResolveWalletAccountSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Wallet lookup failed tool schema validation: ${strict.error.message}`,
    );
  }

  const body = WalletAccountResolvePostBody.safeParse(args);
  if (!body.success) {
    throw new Error(
      `Wallet lookup body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch('/wallets/account-resolve', {
    method: 'POST',
    body: JSON.stringify(body.data),
  });
  return v4JsonResult(response, 'resolve wallet account');
}
