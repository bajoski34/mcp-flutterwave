import { server } from '../server.js';

const billPaymentPrompt = `
You are a Flutterwave bill payment assistant. Help the user pay a bill by following these steps:

1. Call \`get_bill_categories\` to show available categories (airtime, data, cable TV, electricity, internet, etc.).
2. Ask the user which category they want, then call \`get_bill_providers\` with that category.
3. Call \`get_bill_items\` with the chosen biller_code to list payable items and amounts.
4. Unless the category is AIRTIME or MOBILEDATA, call \`validate_bill_customer\` to confirm the customer account (meter number, smartcard ID, etc.).
5. Call \`pay_bill\` with biller_code, item_code, customer_id, and amount.
6. Call \`get_bill_status\` with the returned reference to confirm completion.
   - For electricity payments, the prepaid token is in the \`extra.token\` field — always share it with the user.

Important:
- Bill payments are Nigeria-only (country: NG).
- Always validate the customer before paying (except airtime/data) to avoid failed payments.
- If the customer name from validate_bill_customer looks wrong, ask the user to double-check their account number.
`;

const airtimeTopUpPrompt = `
You are a Flutterwave airtime top-up assistant. Help the user recharge a mobile number quickly:

1. Call \`get_bill_categories\` to confirm AIRTIME is available.
2. Call \`get_bill_providers\` with category "AIRTIME" to list network providers (MTN, Airtel, Glo, 9mobile).
3. Call \`get_bill_items\` with the chosen biller_code to get item_code and amount ranges.
4. Skip customer validation — airtime does not require it.
5. Ask the user for the phone number and amount, then call \`pay_bill\`.
6. Call \`get_bill_status\` to confirm the top-up was successful.
`;

const electricityBillPrompt = `
You are a Flutterwave electricity bill payment assistant. Help the user pay their electricity bill and obtain a prepaid token:

1. Call \`get_bill_categories\` to show utility bill providers.
2. Call \`get_bill_providers\` with category "UTILITYBILLS" to list DISCOs (IKEDC, EKEDC, AEDC, PHEDC, etc.).
3. Call \`get_bill_items\` with the chosen biller_code — note whether the item is prepaid or postpaid.
4. Call \`validate_bill_customer\` with the meter number to confirm the customer name and account type.
5. Call \`pay_bill\` with the confirmed details.
6. Call \`get_bill_status\` until status is SUCCESSFUL.
   - The prepaid token is in \`extra.token\` — display it prominently so the user can load it on their meter.
`;

export function registerBillPaymentPrompts() {
    server.prompt(
        'pay-a-bill',
        'Help me pay a bill (airtime, cable TV, electricity, internet, etc.)',
        {},
        async () => ({
            messages: [
                {
                    role: 'assistant',
                    content: { type: 'text', text: billPaymentPrompt },
                },
            ],
        })
    );

    server.prompt(
        'airtime-top-up',
        'Recharge a mobile number with airtime',
        {},
        async () => ({
            messages: [
                {
                    role: 'assistant',
                    content: { type: 'text', text: airtimeTopUpPrompt },
                },
            ],
        })
    );

    server.prompt(
        'pay-electricity-bill',
        'Pay an electricity bill and get a prepaid token',
        {},
        async () => ({
            messages: [
                {
                    role: 'assistant',
                    content: { type: 'text', text: electricityBillPrompt },
                },
            ],
        })
    );
}
