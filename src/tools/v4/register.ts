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
import {
  getCustomer,
  GetCustomerSchema,
  type GetCustomerArgs,
} from './getCustomer.js';
import {
  getRefund,
  GetRefundSchema,
  type GetRefundArgs,
} from './getRefund.js';
import {
  getPaymentMethod,
  GetPaymentMethodSchema,
  type GetPaymentMethodArgs,
} from './getPaymentMethod.js';
import {
  listCustomers,
  ListCustomersSchema,
  type ListCustomersArgs,
} from './listCustomers.js';
import {
  searchCustomers,
  SearchCustomersSchema,
  type SearchCustomersArgs,
} from './searchCustomers.js';
import {
  updateCustomer,
  UpdateCustomerSchema,
  type UpdateCustomerArgs,
} from './updateCustomer.js';
import {
  listCharges,
  ListChargesSchema,
  type ListChargesArgs,
} from './listCharges.js';
import {
  updateCharge,
  UpdateChargeSchema,
  type UpdateChargeArgs,
} from './updateCharge.js';
import {
  listRefunds,
  ListRefundsSchema,
  type ListRefundsArgs,
} from './listRefunds.js';
import {
  listPaymentMethods,
  ListPaymentMethodsSchema,
  type ListPaymentMethodsArgs,
} from './listPaymentMethods.js';
import { getFees, GetFeesSchema, type GetFeesArgs } from './getFees.js';
import { getBanks, GetBanksSchema, type GetBanksArgs } from './getBanks.js';
import {
  getMobileNetworks,
  GetMobileNetworksSchema,
  type GetMobileNetworksArgs,
} from './getMobileNetworks.js';

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

export async function handleGetCustomer(args: GetCustomerArgs) {
  try {
    return await getCustomer(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error retrieving customer: ${message}`);
  }
}

export async function handleGetRefund(args: GetRefundArgs) {
  try {
    return await getRefund(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error retrieving refund: ${message}`);
  }
}

export async function handleListCustomers(args: ListCustomersArgs) {
  try {
    return await listCustomers(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error listing customers: ${message}`);
  }
}

export async function handleSearchCustomers(args: SearchCustomersArgs) {
  try {
    return await searchCustomers(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error searching customers: ${message}`);
  }
}

export async function handleUpdateCustomer(args: UpdateCustomerArgs) {
  try {
    return await updateCustomer(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error updating customer: ${message}`);
  }
}

export async function handleListCharges(args: ListChargesArgs) {
  try {
    return await listCharges(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error listing charges: ${message}`);
  }
}

export async function handleUpdateCharge(args: UpdateChargeArgs) {
  try {
    return await updateCharge(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error updating charge: ${message}`);
  }
}

export async function handleListRefunds(args: ListRefundsArgs) {
  try {
    return await listRefunds(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error listing refunds: ${message}`);
  }
}

export async function handleListPaymentMethods(args: ListPaymentMethodsArgs) {
  try {
    return await listPaymentMethods(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error listing payment methods: ${message}`);
  }
}

export async function handleGetFees(args: GetFeesArgs) {
  try {
    return await getFees(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error retrieving fees: ${message}`);
  }
}

export async function handleGetBanks(args: GetBanksArgs) {
  try {
    return await getBanks(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error retrieving banks: ${message}`);
  }
}

export async function handleGetMobileNetworks(args: GetMobileNetworksArgs) {
  try {
    return await getMobileNetworks(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error retrieving mobile networks: ${message}`);
  }
}

export async function handleGetPaymentMethod(args: GetPaymentMethodArgs) {
  try {
    return await getPaymentMethod(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error retrieving payment method: ${message}`);
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

  server.tool(
    'get_customer',
    [
      'Retrieve a Flutterwave v4 customer by id (GET /customers/{id}).',
      'Use after create_customer. Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    GetCustomerSchema,
    async (args) => handleGetCustomer(args),
  );

  server.tool(
    'get_refund',
    [
      'Retrieve a Flutterwave v4 refund by id (GET /refunds/{id}).',
      'Use after create_refund to poll status. Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    GetRefundSchema,
    async (args) => handleGetRefund(args),
  );

  server.tool(
    'get_payment_method',
    [
      'Retrieve a Flutterwave v4 payment method by id (GET /payment-methods/{id}).',
      'Use after create_card_payment_method. Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    GetPaymentMethodSchema,
    async (args) => handleGetPaymentMethod(args),
  );

  server.tool(
    'list_customers',
    [
      'List Flutterwave v4 customers (GET /customers).',
      'Page size must be 10 to 50. Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    ListCustomersSchema,
    async (args) => handleListCustomers(args),
  );

  server.tool(
    'search_customers',
    [
      'Search Flutterwave v4 customers by email (POST /customers/search).',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    SearchCustomersSchema,
    async (args) => handleSearchCustomers(args),
  );

  server.tool(
    'update_customer',
    [
      'Update a Flutterwave v4 customer (PUT /customers/{id}).',
      'Pass at least one of name, phone, address, or meta.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    UpdateCustomerSchema,
    async (args) => handleUpdateCustomer(args),
  );

  server.tool(
    'list_charges',
    [
      'List Flutterwave v4 charges (GET /charges).',
      'Optional filters: status, reference, customer_id, payment_method_id, from, to.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    ListChargesSchema,
    async (args) => handleListCharges(args),
  );

  server.tool(
    'update_charge',
    [
      'Update a Flutterwave v4 charge (PUT /charges/{id}).',
      'Pass meta and/or an authorization object (otp, pin, external_3ds, or avs).',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    UpdateChargeSchema,
    async (args) => handleUpdateCharge(args),
  );

  server.tool(
    'list_refunds',
    [
      'List Flutterwave v4 refunds (GET /refunds).',
      'Optional from/to range. Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    ListRefundsSchema,
    async (args) => handleListRefunds(args),
  );

  server.tool(
    'list_payment_methods',
    [
      'List Flutterwave v4 payment methods (GET /payment-methods).',
      'Page size must be 10 to 50. Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    ListPaymentMethodsSchema,
    async (args) => handleListPaymentMethods(args),
  );

  server.tool(
    'get_fees',
    [
      'Retrieve Flutterwave v4 transaction fees (GET /fees).',
      'Requires amount, currency, and payment_method. Optional card6, country, and network.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    GetFeesSchema,
    async (args) => handleGetFees(args),
  );

  server.tool(
    'get_banks',
    [
      'List Flutterwave v4 banks for a country (GET /banks?country=).',
      'Country is an ISO2 code such as NG. Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    GetBanksSchema,
    async (args) => handleGetBanks(args),
  );

  server.tool(
    'get_mobile_networks',
    [
      'List Flutterwave v4 mobile networks for a country (GET /mobile-networks?country=).',
      'Country is an ISO2 code such as GH. Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    GetMobileNetworksSchema,
    async (args) => handleGetMobileNetworks(args),
  );
}
