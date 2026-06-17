import transactions from "./lib/transactions.js"
import checkout from "./lib/checkout.js";
import Plan from "./lib/plan.js";
import transfer from "./lib/transfer.js";
import charge from "./lib/charge.js";
import virtualAccount from "./lib/virtual-account.js";
import billPayment from "./lib/bill-payment.js";
import fxTrade from "./lib/fx-trade.js";
import verification from "./lib/verification.js";

// Cache plan instance to avoid repeated instantiation
let _planInstance: Plan | null = null;

export default class Flutterwave {
    static transactions() {
        return transactions;
    }

    static checkout() {
        return checkout;
    }

    static plans() {
        if (!_planInstance) {
            _planInstance = new Plan();
        }
        return _planInstance;
    }

    static transfers() {
        return transfer;
    }

    static charges() {
        return charge;
    }

    static virtualAccounts() {
        return virtualAccount;
    }

    static billPayments() {
        return billPayment;
    }

    static fxTrades() {
        return fxTrade;
    }

    static verification() {
        return verification;
    }
}