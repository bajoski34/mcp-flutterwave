import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { PaymentMethodsGetParams } from '../../client/generated/v4/payment-methods-get.zod.js';

export const GetPaymentMethodSchema = {
  id: z
    .string()
    .min(1)
    .describe('ID of the payment method to retrieve (pmd_…).'),
};

export type GetPaymentMethodArgs = {
  id: string;
};

export async function getPaymentMethod(
  args: GetPaymentMethodArgs,
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  // Defense in depth: the generated PaymentMethodsGetParams is a bare z.string(),
  // so the tool schema's min(1) guard is re-enforced here for direct callers.
  const strict = z.object(GetPaymentMethodSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Payment method id failed tool schema validation: ${strict.error.message}`,
    );
  }

  const parsed = PaymentMethodsGetParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Payment method id failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/payment-methods/${encodeURIComponent(parsed.data.id)}`,
    { method: 'GET' },
  );

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(
      `Flutterwave v4 get payment method request failed: ${response.status} ${raw}`,
    );
  }

  let payload: unknown = raw;
  try {
    payload = raw === '' ? null : JSON.parse(raw);
  } catch {
    payload = raw;
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          { status: response.status, body: payload },
          null,
          2,
        ),
      },
    ],
  };
}
