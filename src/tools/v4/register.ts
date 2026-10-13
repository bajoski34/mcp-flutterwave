import { server } from '../../server.js';
import {
  createCardPaymentMethod,
  CreateCardPaymentMethodSchema,
  type CreateCardPaymentMethodArgs,
} from './createCardPaymentMethod.js';
import {
  createCustomer,
  CreateCustomerSchema,
  type CreateCustomerArgs,
} from './createCustomer.js';
import {
  createCharge,
  CreateChargeSchema,
  type CreateChargeArgs,
} from './createCharge.js';
import {
  getCharge,
  GetChargeSchema,
  type GetChargeArgs,
} from './getCharge.js';
import {
  createRefund,
  CreateRefundSchema,
  type CreateRefundArgs,
} from './createRefund.js';

function createErrorResponse(message: string) {
  return {
    isError: true as const,
    content: [{ type: 'text' as const, text: message }],
  };
}

export async function handleCreateCardPaymentMethod(
  args: CreateCardPaymentMethodArgs,
) {
  try {
    return await createCardPaymentMethod(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(
      `Error creating card payment method: ${message}`,
    );
  }
}

export async function handleCreateCustomer(args: CreateCustomerArgs) {
  try {
    return await createCustomer(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error creating customer: ${message}`);
  }
}

export async function handleCreateCharge(args: CreateChargeArgs) {
  try {
    return await createCharge(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error creating charge: ${message}`);
  }
}

export async function handleGetCharge(args: GetChargeArgs) {
  try {
    return await getCharge(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error retrieving charge: ${message}`);
  }
}

export async function handleCreateRefund(args: CreateRefundArgs) {
  try {
    return await createRefund(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error creating refund: ${message}`);
  }
}

export function registerV4PaymentMethodTools() {
  registerV4Tools();
}

export function registerV4Tools() {
  server.tool(
    'create_customer',
    [
      'Create a Flutterwave v4 customer (POST /customers).',
      'Email is required. Optional name, phone, and address improve later charge flows.',
      'Use the returned customer id with create_card_payment_method and create_charge.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    CreateCustomerSchema,
    async (args) => handleCreateCustomer(args),
  );

  server.tool(
    'create_card_payment_method',
    [
      'Create a Flutterwave v4 card payment method (POST /payment-methods).',
      'Pass the plaintext card number, CVV, and expiry. The server encrypts each field with AES-256-GCM before the request.',
      'Use the returned payment method id on a later charge. Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    CreateCardPaymentMethodSchema,
    async (args) => handleCreateCardPaymentMethod(args),
  );

  server.tool(
    'create_charge',
    [
      'Create a Flutterwave v4 charge (POST /charges).',
      'Requires customer_id from create_customer and payment_method_id from create_card_payment_method.',
      'Also pass amount, currency, and a unique reference. Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    CreateChargeSchema,
    async (args) => handleCreateCharge(args),
  );

  server.tool(
    'get_charge',
    [
      'Retrieve a Flutterwave v4 charge by id (GET /charges/{id}).',
      'Use after create_charge to poll status. Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    GetChargeSchema,
    async (args) => handleGetCharge(args),
  );

  server.tool(
    'create_refund',
    [
      'Create a Flutterwave v4 refund (POST /refunds).',
      'Requires charge_id from create_charge, amount, and reason',
      '(duplicate | fraudulent | requested_by_customer | expired_uncaptured_charge).',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    CreateRefundSchema,
    async (args) => handleCreateRefund(args),
  );
}
