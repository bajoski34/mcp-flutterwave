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
import {
  createOrder,
  CreateOrderSchema,
  type CreateOrderArgs,
} from './createOrder.js';
import { getOrder, GetOrderSchema, type GetOrderArgs } from './getOrder.js';
import {
  createVirtualAccount,
  CreateVirtualAccountSchema,
  type CreateVirtualAccountArgs,
} from './createVirtualAccount.js';
import {
  getVirtualAccount,
  GetVirtualAccountSchema,
  type GetVirtualAccountArgs,
} from './getVirtualAccount.js';
import {
  quoteTransferRate,
  QuoteTransferRateSchema,
  type QuoteTransferRateArgs,
} from './quoteTransferRate.js';
import {
  getTransferRate,
  GetTransferRateSchema,
  type GetTransferRateArgs,
} from './getTransferRate.js';
import {
  createOrchestratorCharge,
  CreateOrchestratorChargeSchema,
  type CreateOrchestratorChargeArgs,
} from './createOrchestratorCharge.js';
import {
  createOrchestratorOrder,
  CreateOrchestratorOrderSchema,
  type CreateOrchestratorOrderArgs,
} from './createOrchestratorOrder.js';
import {
  createOrchestratorTransfer,
  CreateOrchestratorTransferSchema,
  type CreateOrchestratorTransferArgs,
} from './createOrchestratorTransfer.js';
import {
  resendWebhook,
  ResendWebhookSchema,
  type ResendWebhookArgs,
} from './resendWebhook.js';
import {
  getBankBranches,
  GetBankBranchesSchema,
  type GetBankBranchesArgs,
} from './getBankBranches.js';
import {
  resolveBankAccount,
  ResolveBankAccountSchema,
  type ResolveBankAccountArgs,
} from './resolveBankAccount.js';
import {
  listOrders,
  ListOrdersSchema,
  type ListOrdersArgs,
} from './listOrders.js';
import {
  updateOrder,
  UpdateOrderSchema,
  type UpdateOrderArgs,
} from './updateOrder.js';
import {
  listVirtualAccounts,
  ListVirtualAccountsSchema,
  type ListVirtualAccountsArgs,
} from './listVirtualAccounts.js';
import {
  updateVirtualAccount,
  UpdateVirtualAccountSchema,
  type UpdateVirtualAccountArgs,
} from './updateVirtualAccount.js';
import {
  listTransferRecipients,
  ListTransferRecipientsSchema,
  type ListTransferRecipientsArgs,
} from './listTransferRecipients.js';
import {
  createTransferRecipient,
  CreateTransferRecipientSchema,
  type CreateTransferRecipientArgs,
} from './createTransferRecipient.js';
import {
  getTransferRecipient,
  GetTransferRecipientSchema,
  type GetTransferRecipientArgs,
} from './getTransferRecipient.js';
import {
  deleteTransferRecipient,
  DeleteTransferRecipientSchema,
  type DeleteTransferRecipientArgs,
} from './deleteTransferRecipient.js';
import {
  listTransferSenders,
  ListTransferSendersSchema,
  type ListTransferSendersArgs,
} from './listTransferSenders.js';
import {
  createTransferSender,
  CreateTransferSenderSchema,
  type CreateTransferSenderArgs,
} from './createTransferSender.js';
import {
  getTransferSender,
  GetTransferSenderSchema,
  type GetTransferSenderArgs,
} from './getTransferSender.js';
import {
  deleteTransferSender,
  DeleteTransferSenderSchema,
  type DeleteTransferSenderArgs,
} from './deleteTransferSender.js';

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

export async function handleCreateOrder(args: CreateOrderArgs) {
  try {
    return await createOrder(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error creating order: ${message}`);
  }
}

export async function handleGetOrder(args: GetOrderArgs) {
  try {
    return await getOrder(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error retrieving order: ${message}`);
  }
}

export async function handleCreateVirtualAccount(args: CreateVirtualAccountArgs) {
  try {
    return await createVirtualAccount(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error creating virtual account: ${message}`);
  }
}

export async function handleGetVirtualAccount(args: GetVirtualAccountArgs) {
  try {
    return await getVirtualAccount(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error retrieving virtual account: ${message}`);
  }
}

export async function handleQuoteTransferRate(args: QuoteTransferRateArgs) {
  try {
    return await quoteTransferRate(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error quoting transfer rate: ${message}`);
  }
}

export async function handleGetTransferRate(args: GetTransferRateArgs) {
  try {
    return await getTransferRate(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error retrieving transfer rate: ${message}`);
  }
}

export async function handleCreateOrchestratorCharge(
  args: CreateOrchestratorChargeArgs,
) {
  try {
    return await createOrchestratorCharge(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error creating orchestrator charge: ${message}`);
  }
}

export async function handleCreateOrchestratorOrder(
  args: CreateOrchestratorOrderArgs,
) {
  try {
    return await createOrchestratorOrder(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error creating orchestrator order: ${message}`);
  }
}

export async function handleCreateOrchestratorTransfer(
  args: CreateOrchestratorTransferArgs,
) {
  try {
    return await createOrchestratorTransfer(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(
      `Error creating orchestrator transfer: ${message}`,
    );
  }
}

export async function handleResendWebhook(args: ResendWebhookArgs) {
  try {
    return await resendWebhook(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error resending webhook: ${message}`);
  }
}

export async function handleGetBankBranches(args: GetBankBranchesArgs) {
  try {
    return await getBankBranches(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error retrieving bank branches: ${message}`);
  }
}

export async function handleResolveBankAccount(args: ResolveBankAccountArgs) {
  try {
    return await resolveBankAccount(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error resolving bank account: ${message}`);
  }
}

export async function handleListOrders(args: ListOrdersArgs) {
  try {
    return await listOrders(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error listing orders: ${message}`);
  }
}

export async function handleUpdateOrder(args: UpdateOrderArgs) {
  try {
    return await updateOrder(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error updating order: ${message}`);
  }
}

export async function handleListVirtualAccounts(args: ListVirtualAccountsArgs) {
  try {
    return await listVirtualAccounts(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error listing virtual accounts: ${message}`);
  }
}

export async function handleUpdateVirtualAccount(args: UpdateVirtualAccountArgs) {
  try {
    return await updateVirtualAccount(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error updating virtual account: ${message}`);
  }
}

export async function handleListTransferRecipients(
  args: ListTransferRecipientsArgs,
) {
  try {
    return await listTransferRecipients(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error listing transfer recipients: ${message}`);
  }
}

export async function handleCreateTransferRecipient(
  args: CreateTransferRecipientArgs,
) {
  try {
    return await createTransferRecipient(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error creating transfer recipient: ${message}`);
  }
}

export async function handleGetTransferRecipient(args: GetTransferRecipientArgs) {
  try {
    return await getTransferRecipient(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error retrieving transfer recipient: ${message}`);
  }
}

export async function handleDeleteTransferRecipient(
  args: DeleteTransferRecipientArgs,
) {
  try {
    return await deleteTransferRecipient(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error deleting transfer recipient: ${message}`);
  }
}

export async function handleListTransferSenders(args: ListTransferSendersArgs) {
  try {
    return await listTransferSenders(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error listing transfer senders: ${message}`);
  }
}

export async function handleCreateTransferSender(args: CreateTransferSenderArgs) {
  try {
    return await createTransferSender(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error creating transfer sender: ${message}`);
  }
}

export async function handleGetTransferSender(args: GetTransferSenderArgs) {
  try {
    return await getTransferSender(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error retrieving transfer sender: ${message}`);
  }
}

export async function handleDeleteTransferSender(args: DeleteTransferSenderArgs) {
  try {
    return await deleteTransferSender(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createErrorResponse(`Error deleting transfer sender: ${message}`);
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

  server.tool(
    'create_order',
    [
      'Create a Flutterwave v4 order (POST /orders).',
      'Requires amount, currency, reference, customer_id, and payment_method_id.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    CreateOrderSchema,
    async (args) => handleCreateOrder(args),
  );

  server.tool(
    'get_order',
    [
      'Retrieve a Flutterwave v4 order by id (GET /orders/{id}).',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    GetOrderSchema,
    async (args) => handleGetOrder(args),
  );

  server.tool(
    'create_virtual_account',
    [
      'Create a Flutterwave v4 virtual account (POST /virtual-accounts).',
      'Requires customer_id, reference, currency (NGN, GHS, EGP, KES, MAD, or ZAR), and account_type (static or dynamic).',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    CreateVirtualAccountSchema,
    async (args) => handleCreateVirtualAccount(args),
  );

  server.tool(
    'get_virtual_account',
    [
      'Retrieve a Flutterwave v4 virtual account by id (GET /virtual-accounts/{id}).',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    GetVirtualAccountSchema,
    async (args) => handleGetVirtualAccount(args),
  );

  server.tool(
    'quote_transfer_rate',
    [
      'Quote a Flutterwave v4 transfer rate (POST /transfers/rates).',
      'Requires source.currency and destination.currency plus destination.amount.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    QuoteTransferRateSchema,
    async (args) => handleQuoteTransferRate(args),
  );

  server.tool(
    'get_transfer_rate',
    [
      'Retrieve a Flutterwave v4 transfer rate by id (GET /transfers/rates/{id}).',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    GetTransferRateSchema,
    async (args) => handleGetTransferRate(args),
  );

  server.tool(
    'create_orchestrator_charge',
    [
      'Create a Flutterwave v4 charge with inline customer and card details (POST /orchestration/direct-charges).',
      'Card fields are encrypted with FLW_ENCRYPTION_KEY_V4 before the request is sent.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    CreateOrchestratorChargeSchema,
    async (args) => handleCreateOrchestratorCharge(args),
  );

  server.tool(
    'create_orchestrator_order',
    [
      'Create a Flutterwave v4 order with inline customer and card details (POST /orchestration/direct-orders).',
      'Card fields are encrypted with FLW_ENCRYPTION_KEY_V4 before the request is sent.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    CreateOrchestratorOrderSchema,
    async (args) => handleCreateOrchestratorOrder(args),
  );

  server.tool(
    'create_orchestrator_transfer',
    [
      'Create a Flutterwave v4 transfer with inline recipient details (POST /direct-transfers).',
      'type is bank, mobile_money, wallet, cash_pickup, or crypto. action is instant, deferred, or scheduled.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    CreateOrchestratorTransferSchema,
    async (args) => handleCreateOrchestratorTransfer(args),
  );

  server.tool(
    'resend_webhook',
    [
      'Resend a Flutterwave v4 webhook (POST /resend-webhook).',
      'type is charge.completed, transfer.disburse, transfer.reversal, or order.authorization.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    ResendWebhookSchema,
    async (args) => handleResendWebhook(args),
  );

  server.tool(
    'get_bank_branches',
    [
      'List Flutterwave v4 branches for a bank (GET /banks/{id}/branches).',
      'The id comes from get_banks.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    GetBankBranchesSchema,
    async (args) => handleGetBankBranches(args),
  );

  server.tool(
    'resolve_bank_account',
    [
      'Resolve a Flutterwave v4 bank account (POST /banks/account-resolve).',
      'Currency is NGN, GBP, USD, GHS, or UGX. NGN account requires code and number.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    ResolveBankAccountSchema,
    async (args) => handleResolveBankAccount(args),
  );

  server.tool(
    'list_orders',
    [
      'List Flutterwave v4 orders (GET /orders).',
      'Optional filters: status, from, to, customer_id, and payment_method_id.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    ListOrdersSchema,
    async (args) => handleListOrders(args),
  );

  server.tool(
    'update_order',
    [
      'Update a Flutterwave v4 order (PUT /orders/{id}).',
      'Provide meta, or action void or capture.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    UpdateOrderSchema,
    async (args) => handleUpdateOrder(args),
  );

  server.tool(
    'list_virtual_accounts',
    [
      'List Flutterwave v4 virtual accounts (GET /virtual-accounts).',
      'Optional filters: from, to, and reference.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    ListVirtualAccountsSchema,
    async (args) => handleListVirtualAccounts(args),
  );

  server.tool(
    'update_virtual_account',
    [
      'Update a Flutterwave v4 virtual account (PUT /virtual-accounts/{id}).',
      'action_type is update_bvn or update_status. update_status sets status to inactive.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    UpdateVirtualAccountSchema,
    async (args) => handleUpdateVirtualAccount(args),
  );

  server.tool(
    'list_transfer_recipients',
    [
      'List Flutterwave v4 transfer recipients (GET /transfers/recipients).',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    ListTransferRecipientsSchema,
    async (args) => handleListTransferRecipients(args),
  );

  server.tool(
    'create_transfer_recipient',
    [
      'Create a Flutterwave v4 transfer recipient (POST /transfers/recipients).',
      'type selects the rail, for example bank_ngn. NGN bank recipients require bank.account_number and bank.code.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    CreateTransferRecipientSchema,
    async (args) => handleCreateTransferRecipient(args),
  );

  server.tool(
    'get_transfer_recipient',
    [
      'Retrieve a Flutterwave v4 transfer recipient (GET /transfers/recipients/{id}).',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    GetTransferRecipientSchema,
    async (args) => handleGetTransferRecipient(args),
  );

  server.tool(
    'delete_transfer_recipient',
    [
      'Delete a Flutterwave v4 transfer recipient (DELETE /transfers/recipients/{id}).',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    DeleteTransferRecipientSchema,
    async (args) => handleDeleteTransferRecipient(args),
  );

  server.tool(
    'list_transfer_senders',
    [
      'List Flutterwave v4 transfer senders (GET /transfers/senders).',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    ListTransferSendersSchema,
    async (args) => handleListTransferSenders(args),
  );

  server.tool(
    'create_transfer_sender',
    [
      'Create a Flutterwave v4 transfer sender (POST /transfers/senders).',
      'type is generic_sender, bank_egp, bank_gbp, bank_eur, or mobile_money_egp. Every sender requires a first and last name.',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    CreateTransferSenderSchema,
    async (args) => handleCreateTransferSender(args),
  );

  server.tool(
    'get_transfer_sender',
    [
      'Retrieve a Flutterwave v4 transfer sender (GET /transfers/senders/{id}).',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    GetTransferSenderSchema,
    async (args) => handleGetTransferSender(args),
  );

  server.tool(
    'delete_transfer_sender',
    [
      'Delete a Flutterwave v4 transfer sender (DELETE /transfers/senders/{id}).',
      'Available only when FLW_API_VERSION=v4.',
    ].join(' '),
    DeleteTransferSenderSchema,
    async (args) => handleDeleteTransferSender(args),
  );
}
