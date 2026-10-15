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
import {
  getWalletBalance,
  GetWalletBalanceSchema,
  type GetWalletBalanceArgs,
} from './getWalletBalance.js';
import {
  listWalletBalances,
  ListWalletBalancesSchema,
  type ListWalletBalancesArgs,
} from './listWalletBalances.js';
import {
  getWalletStatement,
  GetWalletStatementSchema,
  type GetWalletStatementArgs,
} from './getWalletStatement.js';
import {
  resolveWalletAccount,
  ResolveWalletAccountSchema,
  type ResolveWalletAccountArgs,
} from './resolveWalletAccount.js';
import {
  listSettlements,
  ListSettlementsSchema,
  type ListSettlementsArgs,
} from './listSettlements.js';
import {
  getSettlement,
  GetSettlementSchema,
  type GetSettlementArgs,
} from './getSettlement.js';
import {
  listChargebacks,
  ListChargebacksSchema,
  type ListChargebacksArgs,
} from './listChargebacks.js';
import {
  getChargeback,
  GetChargebackSchema,
  type GetChargebackArgs,
} from './getChargeback.js';
import {
  createChargeback,
  CreateChargebackSchema,
  type CreateChargebackArgs,
} from './createChargeback.js';
import {
  updateChargeback,
  UpdateChargebackSchema,
  type UpdateChargebackArgs,
} from './updateChargeback.js';

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

export async function handleGetWalletBalance(args: GetWalletBalanceArgs) {
  try {
    return await getWalletBalance(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error retrieving wallet balance: ${message}`);
  }
}

export async function handleListWalletBalances(args: ListWalletBalancesArgs) {
  try {
    return await listWalletBalances(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error listing wallet balances: ${message}`);
  }
}

export async function handleGetWalletStatement(args: GetWalletStatementArgs) {
  try {
    return await getWalletStatement(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error retrieving wallet statement: ${message}`);
  }
}

export async function handleResolveWalletAccount(args: ResolveWalletAccountArgs) {
  try {
    return await resolveWalletAccount(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error resolving wallet account: ${message}`);
  }
}

export async function handleListSettlements(args: ListSettlementsArgs) {
  try {
    return await listSettlements(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error listing settlements: ${message}`);
  }
}

export async function handleGetSettlement(args: GetSettlementArgs) {
  try {
    return await getSettlement(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error retrieving settlement: ${message}`);
  }
}

export async function handleListChargebacks(args: ListChargebacksArgs) {
  try {
    return await listChargebacks(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error listing chargebacks: ${message}`);
  }
}

export async function handleGetChargeback(args: GetChargebackArgs) {
  try {
    return await getChargeback(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error retrieving chargeback: ${message}`);
  }
}

export async function handleCreateChargeback(args: CreateChargebackArgs) {
  try {
    return await createChargeback(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error creating chargeback: ${message}`);
  }
}

export async function handleUpdateChargeback(args: UpdateChargebackArgs) {
  try {
    return await updateChargeback(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error updating chargeback: ${message}`);
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

  server.tool(
    'get_wallet_balance',
    [
      'Fetch the Flutterwave v4 wallet balance for one currency (GET /wallets/balances/{currency}).',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    GetWalletBalanceSchema,
    async (args) => handleGetWalletBalance(args),
  );

  server.tool(
    'list_wallet_balances',
    [
      'Fetch Flutterwave v4 wallet balances for every currency (GET /wallets/balances).',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    ListWalletBalancesSchema,
    async () => handleListWalletBalances({}),
  );

  server.tool(
    'get_wallet_statement',
    [
      'Retrieve a Flutterwave v4 wallet statement (GET /wallets/statement).',
      'Currency is required. Optional from, to, size, and cursors.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    GetWalletStatementSchema,
    async (args) => handleGetWalletStatement(args),
  );

  server.tool(
    'resolve_wallet_account',
    [
      'Resolve a Flutterwave v4 wallet account (POST /wallets/account-resolve).',
      'Provider is currently flutterwave. Pass the provider identifier.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    ResolveWalletAccountSchema,
    async (args) => handleResolveWalletAccount(args),
  );

  server.tool(
    'list_settlements',
    [
      'List Flutterwave v4 settlements (GET /settlements).',
      'Optional from/to range. Page size must be 10 to 50.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    ListSettlementsSchema,
    async (args) => handleListSettlements(args),
  );

  server.tool(
    'get_settlement',
    [
      'Retrieve a Flutterwave v4 settlement by id (GET /settlements/{id}).',
      'Optional page and size select settlement lines.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    GetSettlementSchema,
    async (args) => handleGetSettlement(args),
  );

  server.tool(
    'list_chargebacks',
    [
      'List Flutterwave v4 chargebacks (GET /chargebacks).',
      'Optional from/to range. Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    ListChargebacksSchema,
    async (args) => handleListChargebacks(args),
  );

  server.tool(
    'get_chargeback',
    [
      'Retrieve a Flutterwave v4 chargeback by id (GET /chargebacks/{id}).',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    GetChargebackSchema,
    async (args) => handleGetChargeback(args),
  );

  server.tool(
    'create_chargeback',
    [
      'Create a Flutterwave v4 chargeback (POST /chargebacks).',
      'Requires charge_id, amount, type (local | international), and expiry in hours.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    CreateChargebackSchema,
    async (args) => handleCreateChargeback(args),
  );

  server.tool(
    'update_chargeback',
    [
      'Update a Flutterwave v4 chargeback (PUT /chargebacks/{id}).',
      'Status is accepted, declined, or partially-accepted.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    UpdateChargebackSchema,
    async (args) => handleUpdateChargeback(args),
  );
}
