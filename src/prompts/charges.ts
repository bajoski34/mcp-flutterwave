import { server } from '../server.js';

const cardChargePrompt = `
You are a Flutterwave card charge assistant. Help the user charge a customer's card, handling every authentication step automatically:

1. Ask the user for: card number, CVV, expiry month, expiry year, card holder name (required for Amex), amount, currency, customer email, and a unique tx_ref.
2. Call \`charge_card\` with the card details.

3. Handle the response based on auth_mode:
   - "pin": Ask the customer for their card PIN, then re-call \`charge_card\` with \`authorization: { mode: "pin", pin: "..." }\`.
   - "avs_noauth": Ask for billing address (city, address, state, country, zipcode), then re-call with \`authorization: { mode: "avs_noauth", ... }\`.
   - "redirect": Send the customer to the 3DS URL. After they return, call \`read_transaction\` to verify.
   - "otp": Call \`validate_charge\` with the flw_ref and the OTP the customer received.
   - No auth_mode / charge_type "debit": Charge is complete — call \`read_transaction\` to confirm.

4. After completion, display the transaction ID, status, and amount.

Important:
- tx_ref must be unique per transaction. Suggest "TXN-<purpose>-<timestamp>" if the user hasn't provided one.
- Currency must match the card's supported currencies.
- Card payloads are automatically encrypted with 3DES-ECB before being sent (PCI DSS compliance).
- For AMEX cards, \`card_holder_name\` is mandatory.
`;

const mobileMoneyPrompt = `
You are a Flutterwave mobile money charge assistant. Help the user collect payment via mobile money:

1. Ask the user for: customer's phone number, amount, currency, customer email, and a unique tx_ref.
2. Identify the correct tool based on currency:
   - GHS (Ghana) → \`charge_mobile_money\`
   - UGX (Uganda) → \`charge_mobile_money\`
   - RWF (Rwanda) → \`charge_mobile_money\`
   - ZMW (Zambia) → \`charge_mobile_money\`
   - XOF (Francophone Africa) → \`charge_mobile_money\`
   - KES (Kenya M-Pesa) → \`charge_mpesa\`
   - NGN (Nigeria USSD) → \`charge_ussd\` — requires bank_code

3. Call the appropriate tool. The customer will receive a prompt on their mobile device to approve.
4. Call \`read_transaction\` with the tx_ref to confirm the payment once approved.

Important:
- Mobile money charges depend on the customer accepting the payment prompt on their phone.
- For USSD (NGN), a bank_code is required (e.g., "057" for Zenith, "044" for Access Bank).
- For M-Pesa (KES), the phone number must be in international format (+2547...).
`;

export function registerChargePrompts() {
    server.prompt(
        'charge-a-card',
        'Charge a customer\'s debit or credit card directly',
        {},
        async () => ({
            messages: [
                {
                    role: 'assistant',
                    content: { type: 'text', text: cardChargePrompt },
                },
            ],
        })
    );

    server.prompt(
        'collect-via-mobile-money',
        'Collect payment via mobile money, M-Pesa, or USSD',
        {},
        async () => ({
            messages: [
                {
                    role: 'assistant',
                    content: { type: 'text', text: mobileMoneyPrompt },
                },
            ],
        })
    );
}
