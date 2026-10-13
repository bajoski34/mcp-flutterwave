import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { CustomersGetParams } from '../../client/generated/v4/customers-get.zod.js';

export const GetCustomerSchema = {
  id: z
    .string()
    .min(1)
    .describe('ID of the customer to retrieve (cus_…).'),
};

export type GetCustomerArgs = {
  id: string;
};

export async function getCustomer(
  args: GetCustomerArgs,
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  // Defense in depth: the generated CustomersGetParams is a bare z.string(),
  // so the tool schema's min(1) guard is re-enforced here for direct callers.
  const strict = z.object(GetCustomerSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Customer id failed tool schema validation: ${strict.error.message}`,
    );
  }

  const parsed = CustomersGetParams.safeParse(args);
  if (!parsed.success) {
    throw new Error(
      `Customer id failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/customers/${encodeURIComponent(parsed.data.id)}`,
    { method: 'GET' },
  );

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(
      `Flutterwave v4 get customer request failed: ${response.status} ${raw}`,
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
