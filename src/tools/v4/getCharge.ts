import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { ChargesGetParams } from '../../client/generated/v4/charges-get.zod.js';

export const GetChargeSchema = {
  id: z
    .string()
    .min(1)
    .describe('ID of the charge to retrieve (chg_…).'),
};

export type GetChargeArgs = {
  id: string;
};

export async function getCharge(
  args: GetChargeArgs,
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  // Defense in depth: the generated ChargesGetParams is a bare z.string(),
  // so the tool schema's min(1) guard is re-enforced here for direct callers.
  const strict = z.object(GetChargeSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Charge id failed tool schema validation: ${strict.error.message}`,
    );
  }

  const parsed = ChargesGetParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Charge id failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/charges/${encodeURIComponent(parsed.data.id)}`,
    { method: 'GET' },
  );

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(
      `Flutterwave v4 get charge request failed: ${response.status} ${raw}`,
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
