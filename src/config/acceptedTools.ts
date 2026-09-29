import { type ApiVersion } from './apiVersion.js';

export const V3_ACCEPTED_TOOLS = [
  'create_checkout',
  'disable_checkout',
  'read_transaction',
  'read_transaction_with_reference',
  'read_transaction_timeline',
  'resend_transaction_webhook',
  'create_transfer',
  'create_beneficiary',
  'list_beneficiaries',
  'create_payment_plan',
  'get_payment_plans',
  'charge_card',
  'charge_bank_account',
  'charge_mobile_money',
  'charge_mpesa',
  'charge_ussd',
  'validate_charge',
  'create_virtual_account',
  'get_virtual_account',
  'update_virtual_account',
  'list_virtual_account_bulk',
  'get_bill_categories',
  'get_bill_providers',
  'get_bill_items',
  'validate_bill_customer',
  'pay_bill',
  'get_bill_status',
  'request_fx_quote',
  'get_fx_quote',
  'initiate_fx_trade',
  'get_fx_trade',
  'initiate_bvn_verification',
  'get_bvn_details',
  'resolve_bank_account',
  'verify_card_bin',
  'get_stablecoin_fee',
  'send_stablecoin',
  'convert_to_stablecoin',
] as const;

export const V4_ACCEPTED_TOOLS = ['create_card_payment_method'] as const;

export function acceptedToolsFor(version: ApiVersion): readonly string[] {
  return version === 'v4' ? V4_ACCEPTED_TOOLS : V3_ACCEPTED_TOOLS;
}
