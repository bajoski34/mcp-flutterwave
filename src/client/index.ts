import transactions from "./lib/transactions.js"
import checkout from "./lib/checkout.js";
import plans from "./lib/plan.js";


export default class Flutterwave {
    static transactions() {
        return transactions;
    }

    static checkout() {
        return checkout;
    }


    static plans() {
        return new plans;
    }
}