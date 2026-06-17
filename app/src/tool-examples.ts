/**
 * Curated input_examples for every Flutterwave MCP tool.
 *
 * These teach Claude:
 *  - tx_ref conventions (prefix patterns, slugs)
 *  - Currency literals paired with the correct charge type
 *  - Date formats, ID prefixes (USR-xxxxx, FLW-MOCK-…)
 *  - Which optional fields to include in common scenarios
 *  - Minimal vs. full specification patterns
 *
 * Improves parameter accuracy from ~72 % → ~90 % per the Anthropic article.
 */
export const TOOL_EXAMPLES: Record<string, Record<string, unknown>[]> = {

    /* ── CHECKOUT ────────────────────────────────────── */
    create_checkout: [
        {
            tx_ref: "TXN-STORE-001-20240610",
            amount: "15000",
            currency: "NGN",
            redirect_url: "https://mystore.com/payment/callback",
            customer: {
                email: "adaeze.okonkwo@example.com",
                name: "Adaeze Okonkwo",
                phonenumber: "08012345678",
            },
            customizations: { title: "Order #1234 — Electronics Store" },
            configurations: { session_duration: 30, max_retry_attempt: 3 },
        },
        {
            tx_ref: "TXN-SAAS-PRO-2024",
            amount: "49.99",
            currency: "USD",
            redirect_url: "https://app.saas.io/upgrade/success",
            customer: {
                email: "user@company.com",
                name: "James Okafor",
                phonenumber: "+2348098765432",
            },
            customizations: { title: "SaaS Pro Plan — Monthly" },
            configurations: { session_duration: 60, max_retry_attempt: 2 },
        },
    ],

    disable_checkout: [
        { link: "https://checkout.flutterwave.com/v3/hosted/pay/flwlnk-01j8hkejppgm821xv8mfxfpgrb" },
    ],

    /* ── DIRECT CHARGES ──────────────────────────────── */
    charge_card: [
        // Initial call — no authorization yet
        {
            tx_ref: "MC-CARD-2024-001",
            amount: "5000",
            currency: "NGN",
            email: "customer@example.com",
            card_number: "5531886652142950",
            cvv: "564",
            expiry_month: "09",
            expiry_year: "32",
            fullname: "Yemi Adeyemi",
            phone_number: "08098765432",
            redirect_url: "https://myapp.com/charge/callback",
        },
        // Second call — PIN flow (after initial call returns mode: "pin")
        {
            tx_ref: "MC-CARD-2024-001",
            amount: "5000",
            currency: "NGN",
            email: "customer@example.com",
            card_number: "5531886652142950",
            cvv: "564",
            expiry_month: "09",
            expiry_year: "32",
            fullname: "Yemi Adeyemi",
            phone_number: "08098765432",
            redirect_url: "https://myapp.com/charge/callback",
            authorization: { mode: "pin", pin: "3310" },
        },
        // Second call — AVS flow (after initial call returns mode: "avs_noauth")
        {
            tx_ref: "MC-CARD-GHS-002",
            amount: "200",
            currency: "GHS",
            email: "kwame@example.com",
            card_number: "4187427415564246",
            cvv: "828",
            expiry_month: "09",
            expiry_year: "32",
            fullname: "Kwame Mensah",
            authorization: {
                mode: "avs_noauth",
                city: "San Francisco",
                address: "69 Fremont Street",
                state: "CA",
                country: "US",
                zipcode: "94105",
            },
        },
        // AMEX card — requires card_holder_name
        {
            tx_ref: "MC-AMEX-USD-003",
            amount: "200",
            currency: "USD",
            email: "john@example.com",
            card_number: "340614670471041",
            cvv: "564",
            expiry_month: "10",
            expiry_year: "31",
            fullname: "John Doe",
            card_holder_name: "John Doe",
            phone_number: "0167578999",
            redirect_url: "https://myapp.com/charge/callback",
        },
    ],

    charge_bank_account: [
        {
            tx_ref: "MC-BANK-NGN-001",
            amount: "10000",
            currency: "NGN",
            email: "chidi@example.com",
            account_bank: "044",
            account_number: "0690000031",
            fullname: "Chidi Okeke",
            phone_number: "09011223344",
        },
        {
            tx_ref: "MC-BANK-GHS-002",
            amount: "500",
            currency: "GHS",
            email: "ama@example.com",
            account_bank: "GH190101",
            account_number: "0551234987",
            fullname: "Ama Asante",
        },
    ],

    charge_mobile_money: [
        {
            type: "mobile_money_ghana",
            tx_ref: "MC-MMO-GH-001",
            amount: "50",
            currency: "GHS",
            email: "kofi@example.com",
            phone_number: "0551234987",
            network: "MTN",
            fullname: "Kofi Boateng",
        },
        {
            type: "mobile_money_uganda",
            tx_ref: "MC-MMO-UG-002",
            amount: "30000",
            currency: "UGX",
            email: "sarah@example.com",
            phone_number: "0712345678",
            network: "MTN",
        },
        {
            type: "mobile_money_francophone",
            tx_ref: "MC-MMO-FR-003",
            amount: "5000",
            currency: "XOF",
            email: "moussa@example.com",
            phone_number: "+221771234567",
            network: "ORANGE",
        },
    ],

    charge_mpesa: [
        {
            tx_ref: "MC-MPESA-KE-001",
            amount: "1500",
            currency: "KES",
            email: "wanjiru@example.com",
            phone_number: "0712345678",
            fullname: "Wanjiru Kamau",
        },
        {
            tx_ref: "MC-MPESA-KE-002",
            amount: "350",
            currency: "KES",
            email: "brian@example.com",
            phone_number: "+254798765432",
        },
    ],

    charge_ussd: [
        {
            tx_ref: "MC-USSD-NGN-001",
            amount: "2500",
            currency: "NGN",
            email: "fatima@example.com",
            account_bank: "044",
            phone_number: "08011223344",
            fullname: "Fatima Aliyu",
        },
        {
            tx_ref: "MC-USSD-NGN-002",
            amount: "500",
            currency: "NGN",
            email: "emeka@example.com",
            account_bank: "033",
            phone_number: "07012345678",
        },
    ],

    validate_charge: [
        {
            otp: "12345",
            flw_ref: "FLW-MOCK-1e9e0e0e0e0e0e0e0e0e0e0e0e0e",
            type: "card",
        },
        {
            otp: "00000",
            flw_ref: "FLW-MOCK-9a9e0e0e0e0e0e0e0e0e0e0e0e0e",
        },
    ],

    /* ── TRANSACTIONS ────────────────────────────────── */
    read_transaction: [
        { tx_id: "4975363" },
        { tx_id: "5100291" },
    ],

    read_transaction_with_reference: [
        { tx_ref: "TXN-STORE-001-20240610" },
        { tx_ref: "MC-CARD-2024-001" },
    ],

    read_transaction_timeline: [
        { tx_id: "4975363" },
    ],

    resend_transaction_webhook: [
        { tx_id: "4975363" },
    ],

    /* ── TRANSFERS ───────────────────────────────────── */
    create_transfer: [
        {
            account_bank: "044",
            account_number: "0690000040",
            amount: 5500,
            currency: "NGN",
            narration: "Freelance payment for October",
            reference: "TRF-FLW-20240610-001",
            beneficiary_name: "Alexis Sanchez",
        },
        {
            account_bank: "044",
            account_number: "0690000031",
            amount: 20000,
            currency: "NGN",
            narration: "Vendor payment",
            debit_currency: "NGN",
        },
    ],

    create_beneficiary: [
        {
            account_bank: "044",
            account_number: "0690000040",
            beneficiary_name: "Alexis Sanchez",
            currency: "NGN",
            bank_name: "ACCESS BANK NIGERIA",
        },
    ],

    list_beneficiaries: [],

    /* ── PAYMENT PLANS ───────────────────────────────── */
    create_payment_plan: [
        {
            name: "Premium Monthly Subscription",
            amount: 4999,
            interval: "monthly",
            duration: 12,
            currency: "NGN",
        },
        {
            name: "Starter Weekly Plan",
            amount: 1000,
            interval: "weekly",
            currency: "NGN",
        },
    ],

    get_payment_plans: [
        { status: "active", interval: "monthly" },
        { status: "active" },
        {},
    ],

    /* ── VIRTUAL ACCOUNTS ───────────────────────────────── */
    create_virtual_account: [
        // NGN dynamic account — one-time, expires in ~1 hour
        {
            email: "adaeze@example.com",
            currency: "NGN",
            tx_ref: "VA-NGN-DYN-20240610-001",
            amount: 15000,
            is_permanent: false,
            narration: "Adaeze Store",
            phonenumber: "+2349012345678",
            firstname: "Adaeze",
            lastname: "Okonkwo",
        },
        // NGN static account — reusable, requires BVN
        {
            email: "emeka@example.com",
            currency: "NGN",
            tx_ref: "VA-NGN-STA-20240610-002",
            is_permanent: true,
            bvn: "22415929481",
            narration: "Emeka Wallet",
            phonenumber: "08012345678",
            firstname: "Emeka",
            lastname: "Okafor",
        },
        // GHS dynamic account with frequency and duration
        {
            email: "kofi@example.com",
            currency: "GHS",
            tx_ref: "VA-GHS-DYN-20240610-003",
            amount: 500,
            is_permanent: false,
            narration: "Kofi Shop",
            phonenumber: "+233244123456",
            firstname: "Kofi",
            lastname: "Boateng",
            frequency: 5,
            duration: 7,
        },
    ],

    get_virtual_account: [
        { order_ref: "URF_1234567890_8044304_NG" },
        { order_ref: "URF_0987654321_1234567_GH" },
    ],

    update_virtual_account: [
        { order_ref: "URF_1234567890_8044304_NG", bvn: "22415929481" },
    ],

    list_virtual_account_bulk: [
        { batch_id: "b_ABCDEF123456" },
    ],

    /* ── BILL PAYMENTS ──────────────────────────────── */
    get_bill_categories: [{}],

    get_bill_providers: [
        { category: "AIRTIME" },
        { category: "UTILITYBILLS" },
        { category: "CABLEBILLS" },
        { category: "MOBILEDATA" },
    ],

    get_bill_items: [
        { biller_code: "BIL119" },   // MTN airtime
        { biller_code: "BIL120" },   // GLO airtime
        { biller_code: "BIL001" },   // DSTV
    ],

    validate_bill_customer: [
        // Cable TV — IUC/smartcard number
        { item_code: "CB140", customer_id: "1234567890" },
        // Electricity — meter number
        { item_code: "UB157", customer_id: "04223785521" },
        // Internet service — account ID
        { item_code: "INT001", customer_id: "user@ispdomain.com" },
    ],

    pay_bill: [
        // Airtime top-up — MTN NGN 500
        {
            biller_code: "BIL119",
            item_code: "AT099",
            customer_id: "08034985033",
            amount: 500,
            country: "NG",
            reference: "BILL-AIRTIME-NGN-20240610-001",
        },
        // DSTV subscription renewal
        {
            biller_code: "BIL001",
            item_code: "CB140",
            customer_id: "1234567890",
            amount: 24500,
            country: "NG",
            reference: "BILL-DSTV-20240610-001",
        },
        // Electricity prepaid — IKEDC
        {
            biller_code: "BIL127",
            item_code: "UB157",
            customer_id: "04223785521",
            amount: 5000,
            country: "NG",
            reference: "BILL-ELEC-20240610-001",
        },
    ],

    get_bill_status: [
        { reference: "BILL-AIRTIME-NGN-20240610-001" },
        { reference: "BILL-ELEC-20240610-001" },
    ],

    /* ── FX TRADE ───────────────────────────────────── */
    request_fx_quote: [
        // NGN → USD: sell NGN, receive USD (min ~NGN 1.5M = $1,000)
        {
            base_currency: "NGN",
            target_currency: "USD",
            quantity: 1617759,
            reference: "FX-NGN-USD-20240610-001",
        },
        // GHS → USD
        {
            base_currency: "GHS",
            target_currency: "USD",
            quantity: 15000,
            reference: "FX-GHS-USD-20240610-001",
        },
        // USD → NGN
        {
            base_currency: "USD",
            target_currency: "NGN",
            quantity: 5000,
            reference: "FX-USD-NGN-20240610-001",
        },
    ],

    get_fx_quote: [
        { quote_id: "c085aab5-5938-46a7-90a9-22420c2a8d6e" },
    ],

    initiate_fx_trade: [
        {
            quote_id: "c085aab5-5938-46a7-90a9-22420c2a8d6e",
            narration: "Q1 vendor payment conversion",
        },
        {
            quote_id: "a712bc34-1234-5678-abcd-efghij890123",
            narration: "Monthly payroll FX conversion",
        },
    ],

    get_fx_trade: [
        { trade_id: "30b85c03-9124-4418-b30b-0495ffbdc633" },
    ],

    /* ── VERIFICATION ───────────────────────────────── */
    initiate_bvn_verification: [
        {
            bvn: "22415929481",
            firstname: "Desola",
            lastname: "Ade",
            redirect_url: "https://myapp.com/bvn/callback",
        },
        {
            bvn: "12345678901",
            firstname: "Emeka",
            lastname: "Okafor",
            redirect_url: "https://mystore.com/kyc/complete",
        },
    ],

    get_bvn_details: [
        { reference: "BVN-REF-20240610-001" },
        { reference: "flw-bvn-ref-abc123def456" },
    ],

    resolve_bank_account: [
        // Access Bank NGN account
        { account_number: "0690000040", account_bank: "044" },
        // Zenith Bank
        { account_number: "2012345678", account_bank: "057" },
        // GTBank
        { account_number: "0123456789", account_bank: "058" },
        // First Bank
        { account_number: "3012345678", account_bank: "011" },
    ],

    verify_card_bin: [
        { bin: "553188" },   // Mastercard
        { bin: "404042" },   // Visa
        { bin: "340614" },   // AMEX
        { bin: "650002" },   // Verve
    ],

    /* ── STABLECOINS ────────────────────────────────── */
    get_stablecoin_fee: [
        // Same-currency: USDC → USDC (flat fee)
        { amount: 50, currency: "USDC" },
        // Cross-currency: NGN → USDT (percentage fee)
        { amount: 100, currency: "USDT", debit_currency: "NGN" },
        // Cross-currency: USD → USDC
        { amount: 200, currency: "USDC", debit_currency: "USD" },
    ],

    send_stablecoin: [
        // Send USDT to a Polygon wallet
        {
            wallet_address: "0xAbC1234567890dEf1234567890aBcDeF12345678",
            amount: 50,
            currency: "USDT",
            debit_currency: "USDT",
            reference: "CRYPTO-USDT-20240610-001",
            narration: "Payment for services",
        },
        // Send USDC to a Polygon wallet
        {
            wallet_address: "0xAbC1234567890dEf1234567890aBcDeF12345678",
            amount: 100,
            currency: "USDC",
            debit_currency: "USDC",
            reference: "CRYPTO-USDC-20240610-001",
        },
    ],

    convert_to_stablecoin: [
        // NGN → USDT
        {
            merchant_id: "300408963",
            amount: 1500000,
            currency: "USDT",
            debit_currency: "NGN",
            reference: "CONVERT-NGN-USDT-20240610-001",
            narration: "NGN to USDT conversion",
        },
        // USD → USDC
        {
            merchant_id: "300408963",
            amount: 1000,
            currency: "USDC",
            debit_currency: "USD",
            reference: "CONVERT-USD-USDC-20240610-001",
        },
    ],
};
