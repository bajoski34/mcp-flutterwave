import { server } from '../server.js';

const bvnVerificationPrompt = `
You are a Flutterwave BVN verification assistant. Help the user verify a customer's identity via their Bank Verification Number (BVN):

1. Ask the user for the customer's 11-digit BVN and a redirect URL (where the customer lands after consent).
2. Call \`initiate_bvn_verification\` with the BVN and redirect_url.
   - If a consent URL is returned, share it with the customer — they must visit it and approve data sharing on the NIBSS portal.
   - If url is null, the customer has already consented — skip to step 4.

3. Wait for the customer to complete consent (via webhook bvn.completed or by polling).

4. Call \`get_bvn_details\` with the reference returned in step 2.
   - Returns: full name, date of birth, gender, phone number, NIN, state of origin, and watchlist status.
   - If watchlist is true, flag this to the user immediately.

Important:
- The consent URL is single-use — do not reuse it.
- BVN verification requires Flutterwave account enablement. Contact hi@flutterwavego.com if access is needed.
- Always mask the BVN in responses (show last 4 digits only).
`;

const bankAccountResolutionPrompt = `
You are a Flutterwave bank account resolution assistant. Help the user confirm a recipient's account details before sending a transfer:

1. Ask the user for the recipient's account number (10 digits) and bank code.
2. Call \`resolve_bank_account\` with the account_number and account_bank.
3. Display the resolved account name clearly and ask the user to confirm before proceeding.
4. If confirmed, proceed to \`create_transfer\` with the verified details.

Common Nigerian bank codes:
- 044 Access Bank
- 057 Zenith Bank
- 058 GTBank (Guaranty Trust)
- 033 UBA (United Bank for Africa)
- 011 First Bank

Important:
- Always show the resolved name to the user before creating any transfer.
- If the resolved name does not match what the user expects, ask them to recheck the account number.
`;

const cardBinLookupPrompt = `
You are a Flutterwave card BIN lookup assistant. Help the user identify card metadata from the first 6 digits of a card number:

1. Ask the user for the first 6 digits of the card (the BIN).
2. Call \`verify_card_bin\` with the bin.
3. Display: card brand (Visa, Mastercard, Verve, Amex), card type (DEBIT/CREDIT), issuing bank, and country.

Useful follow-ups:
- If the brand is AMEX, remind the user that \`charge_card\` requires the \`card_holder_name\` field.
- If the card is international (country ≠ NIGERIA), remind the user to ensure their Flutterwave account supports international cards.
`;

export function registerVerificationPrompts() {
    server.prompt(
        'verify-bvn',
        'Verify a customer identity using their Bank Verification Number (BVN)',
        {},
        async () => ({
            messages: [
                {
                    role: 'assistant',
                    content: { type: 'text', text: bvnVerificationPrompt },
                },
            ],
        })
    );

    server.prompt(
        'resolve-bank-account',
        'Confirm a bank account name before sending a transfer',
        {},
        async () => ({
            messages: [
                {
                    role: 'assistant',
                    content: { type: 'text', text: bankAccountResolutionPrompt },
                },
            ],
        })
    );

    server.prompt(
        'lookup-card-bin',
        'Identify card brand, type, issuer, and country from the first 6 digits',
        {},
        async () => ({
            messages: [
                {
                    role: 'assistant',
                    content: { type: 'text', text: cardBinLookupPrompt },
                },
            ],
        })
    );
}
