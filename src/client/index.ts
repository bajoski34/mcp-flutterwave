import transactions from "./lib/transactions.js"
import checkout from "./lib/checkout.js";
import Plan from "./lib/plan.js";

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
}