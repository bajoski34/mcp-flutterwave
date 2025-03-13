import transactions from "./lib/transactions.js"
import checkout from "./lib/checkout.js";

export default class Flutterwave {
    static transactions() {
        return transactions;
    }

    static checkout() {
        return checkout;
    }
}