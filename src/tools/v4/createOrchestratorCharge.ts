import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { encryptCardFields } from '../../client/v4/encryption.js';
import { OrchestrationDirectChargePostBody } from '../../client/generated/v4/orchestration-direct-charge.zod.js';
import { config } from '../../config/index.js';
import { v4JsonResult } from './httpResult.js';

const cardFields = {
  card_number: z
    .string()
    .regex(/^\d{12,19}$/, 'Card number must be 12 to 19 digits'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  expiry_month: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, 'Expiry month must be 01-12'),
  expiry_year: z
    .string()
    .regex(/^\d{2}$/, 'Expiry year must be 2 digits, for example 32'),
  card_holder_name: z.string().min(1).optional(),
};

export const CreateOrchestratorChargeSchema = {
  amount: OrchestrationDirectChargePostBody.shape.amount,
  currency: OrchestrationDirectChargePostBody.shape.currency,
  reference: OrchestrationDirectChargePostBody.shape.reference,
  customer: OrchestrationDirectChargePostBody.shape.customer,
  ...cardFields,
  redirect_url: OrchestrationDirectChargePostBody.shape.redirect_url,
  meta: OrchestrationDirectChargePostBody.shape.meta,
  merchant_vat_amount:
    OrchestrationDirectChargePostBody.shape.merchant_vat_amount,
};

export type CreateOrchestratorChargeArgs = {
  amount: number;
  currency: string;
  reference: string;
  customer: {
    email: string;
    name?: { first?: string; middle?: string; last?: string };
    phone?: { country_code: string; number: string };
    address?: {
      city: string;
      country: string;
      line1: string;
      line2?: string;
      postal_code: string;
      state: string;
    };
    meta?: Record<string, string>;
  };
  card_number: string;
  cvv: string;
  expiry_month: string;
  expiry_year: string;
  card_holder_name?: string;
  redirect_url?: string;
  meta?: Record<string, string>;
  merchant_vat_amount?: number;
};

function withoutUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

export async function createOrchestratorCharge(
  args: CreateOrchestratorChargeArgs,
) {
  const strict = z.object(CreateOrchestratorChargeSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Orchestrator charge failed tool schema validation: ${strict.error.message}`,
    );
  }

  const encryptionKey = config.flutterwave.encryptionKeyV4;
  if (!encryptionKey) {
    throw new Error(
      'FLW_ENCRYPTION_KEY_V4 is required to create a v4 orchestrator charge',
    );
  }

  const encrypted = encryptCardFields(
    {
      cardNumber: args.card_number,
      cvv: args.cvv,
      expiryMonth: args.expiry_month,
      expiryYear: args.expiry_year,
    },
    encryptionKey,
  );

  const body = OrchestrationDirectChargePostBody.safeParse(
    withoutUndefined({
      amount: args.amount,
      currency: args.currency,
      reference: args.reference,
      customer: args.customer,
      redirect_url: args.redirect_url,
      meta: args.meta,
      merchant_vat_amount: args.merchant_vat_amount,
      payment_method: {
        type: 'card',
        card: withoutUndefined({
          nonce: encrypted.nonce,
          encrypted_card_number: encrypted.encrypted_card_number,
          encrypted_cvv: encrypted.encrypted_cvv,
          encrypted_expiry_month: encrypted.encrypted_expiry_month,
          encrypted_expiry_year: encrypted.encrypted_expiry_year,
          card_holder_name: args.card_holder_name,
        }),
      },
    }),
  );
  if (!body.success) {
    throw new Error(
      `Orchestrator charge body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch('/orchestration/direct-charges', {
    method: 'POST',
    body: JSON.stringify(body.data),
  });
  return v4JsonResult(response, 'create orchestrator charge');
}
