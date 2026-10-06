import { server } from '../../server.js';
import {
  createCardPaymentMethod,
  CreateCardPaymentMethodSchema,
  type CreateCardPaymentMethodArgs,
} from './createCardPaymentMethod.js';

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

export function registerV4PaymentMethodTools() {
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
}
