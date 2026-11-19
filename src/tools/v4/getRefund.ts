import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { RefundsGetParams } from '../../client/generated/v4/refunds-get.zod.js';

export const GetRefundSchema = {
  id: z
    .string()
    .min(1)
    .describe('ID of the refund to retrieve (rfd_…).'),
};

export type GetRefundArgs = {
  id: string;
};

export async function getRefund(
  args: GetRefundArgs,
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  // Defense in depth: the generated RefundsGetParams is a bare z.string(),
  // so the tool schema's min(1) guard is re-enforced here for direct callers.
  const strict = z.object(GetRefundSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Refund id failed tool schema validation: ${strict.error.message}`,
    );
  }

  const parsed = RefundsGetParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Refund id failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/refunds/${encodeURIComponent(parsed.data.id)}`,
    { method: 'GET' },
  );

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(
      `Flutterwave v4 get refund request failed: ${response.status} ${raw}`,
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
