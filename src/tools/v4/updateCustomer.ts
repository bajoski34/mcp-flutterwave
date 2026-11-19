import { z } from 'zod';
import { flwV4Fetch } from '../../client/v4/http.js';
import {
  CustomersPutBody,
  CustomersPutParams,
} from '../../client/generated/v4/customers-update.zod.js';
import { v4JsonResult } from './httpResult.js';

export const UpdateCustomerSchema = {
  id: z.string().min(1).describe('ID of the customer to update (cus_…).'),
  name: CustomersPutBody.shape.name,
  phone: CustomersPutBody.shape.phone,
  address: CustomersPutBody.shape.address,
  meta: CustomersPutBody.shape.meta,
};

export type UpdateCustomerArgs = {
  id: string;
  name?: z.infer<typeof CustomersPutBody>['name'];
  phone?: z.infer<typeof CustomersPutBody>['phone'];
  address?: z.infer<typeof CustomersPutBody>['address'];
  meta?: z.infer<typeof CustomersPutBody>['meta'];
};

export async function updateCustomer(args: UpdateCustomerArgs) {
  const strict = z.object(UpdateCustomerSchema).safeParse(args);
  if (!strict.success) {
    throw new Error(
      `Customer update failed tool schema validation: ${strict.error.message}`,
    );
  }

  const { id, ...bodyInput } = strict.data;
  if (
    bodyInput.name === undefined &&
    bodyInput.phone === undefined &&
    bodyInput.address === undefined &&
    bodyInput.meta === undefined
  ) {
    throw new Error(
      'Customer update failed tool schema validation: provide name, phone, address, or meta',
    );
  }

  const idParsed = CustomersPutParams.safeParse({ id });
  if (!idParsed.success) {
    throw new Error(
      `Customer id failed generated schema validation: ${idParsed.error.message}`,
    );
  }

  const body = CustomersPutBody.safeParse(bodyInput);
  if (!body.success) {
    throw new Error(
      `Customer update body failed generated schema validation: ${body.error.message}`,
    );
  }

  const response = await flwV4Fetch(
    `/customers/${encodeURIComponent(idParsed.data.id)}`,
    { method: 'PUT', body: JSON.stringify(body.data) },
  );
  return v4JsonResult(response, 'update customer');
}
