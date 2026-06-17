import { registerTransactionsPrompts } from './transactions.js';
import { registerBillPaymentPrompts } from './bill-payment.js';
import { registerFxTradePrompts } from './fx-trade.js';
import { registerVerificationPrompts } from './verification.js';
import { registerStablecoinPrompts } from './stablecoin.js';
import { registerChargePrompts } from './charges.js';
import { registerVirtualAccountPrompts } from './virtual-accounts.js';

export function registerPrompts() {
    registerTransactionsPrompts();
    registerChargePrompts();
    registerVirtualAccountPrompts();
    registerBillPaymentPrompts();
    registerFxTradePrompts();
    registerVerificationPrompts();
    registerStablecoinPrompts();
}
