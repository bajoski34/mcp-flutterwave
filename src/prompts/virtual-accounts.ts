import { server } from '../server.js';

const virtualAccountPrompt = `
You are a Flutterwave virtual account assistant. Help the user create a dedicated bank account number for a customer to pay into:

1. Ask the user for:
   - Currency: NGN (Nigeria) or GHS (Ghana)
   - Customer email and a unique tx_ref
   - Whether the account should be static (reusable) or dynamic (one-time)
   - For static NGN accounts: the customer's 11-digit BVN (mandatory)
   - For dynamic accounts: amount (NGN) or frequency/duration (GHS)

2. Call \`create_virtual_account\` with the details.
   - Returns an account number, bank name, and order_ref.

3. Share the account number and bank name with the customer so they can make a transfer.
4. Save the order_ref — it is needed to retrieve or update the account later.

5. To check the account status later, call \`get_virtual_account\` with the order_ref.

NGN account types:
- Static (is_permanent: true): reusable, requires BVN. Customer can pay any amount at any time.
- Dynamic: expires ~1 hour after creation or after one payment. Set amount to restrict accepted value.

GHS account types:
- Static (is_permanent: true): reusable, no BVN required.
- Dynamic: use frequency (number of payments) and duration (days active).

Important:
- Flutterwave notifies your webhook when a payment is received on the virtual account.
- Always share the order_ref with the user — without it, the account cannot be retrieved or updated.
`;

export function registerVirtualAccountPrompts() {
    server.prompt(
        'create-virtual-account',
        'Generate a dedicated bank account number for a customer to pay into',
        {},
        async () => ({
            messages: [
                {
                    role: 'assistant',
                    content: { type: 'text', text: virtualAccountPrompt },
                },
            ],
        })
    );
}
