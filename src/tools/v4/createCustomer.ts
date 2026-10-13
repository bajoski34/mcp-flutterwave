import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import { CustomersCreateBody } from '../../client/generated/v4/customers.zod.js';

export const CreateCustomerSchema = {
  email: z
    .string()
    .email('A valid email is required')
    .describe("The customer's email address."),
  name: z
    .object({
      first: z.string().min(2).optional(),
      middle: z.string().min(2).optional(),
      last: z.string().min(2).optional(),
    })
    .optional()
    .describe("The customer's name."),
  phone: z
    .object({
      country_code: z
        .string()
        .regex(/^[0-9]{1,3}$/, 'Dialling country code without +'),
      number: z
        .string()
        .regex(/^[0-9]{7,10}$/, 'Phone number without country code'),
    })
    .optional()
    .describe("The customer's mobile number."),
  address: z
    .object({
      city: z.string().min(1),
      country: z.string().regex(/^[A-Z]{2}$/, 'Country must be an ISO2 code'),
      line1: z.string().min(1),
      line2: z.string().min(1).optional(),
      postal_code: z.string().min(1),
      state: z.string().min(1),
    })
    .optional()
    .describe('Customer address information.'),
  meta: z.record(z.string(), z.string()).optional(),
};

export type CreateCustomerArgs = {
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

function withoutUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

export async function createCustomer(
  args: CreateCustomerArgs,
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const body = withoutUndefined({
    email: args.email,
    name: args.name ? withoutUndefined({ ...args.name }) : undefined,
    phone: args.phone,
    address: args.address
      ? withoutUndefined({ ...args.address })
      : undefined,
    meta: args.meta,
  });

  const parsed = CustomersCreateBody.safeParse(body);
  if (!parsed.success) {
    throw new Error(
      `Customer payload failed generated schema validation: ${parsed.error.message}`,
    );
  }

  const response = await flwV4Fetch('/customers', {
    method: 'POST',
    body: JSON.stringify(parsed.data),
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(
      `Flutterwave v4 customer request failed: ${response.status} ${raw}`,
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
