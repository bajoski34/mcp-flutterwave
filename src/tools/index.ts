import {registerCheckoutTools} from './checkout.js';
import { registerTransactionTools } from './transaction.js';
import { registerRequiredTools } from './required.js';
import { registerPlanTools } from './plan.js';
import {registerTransferTools} from "./transfer.js";
import { registerChargeTools } from "./charge.js";
import { registerVirtualAccountTools } from "./virtual-account.js";
import { registerBillPaymentTools } from "./bill-payment.js";
import { registerFxTradeTools } from "./fx-trade.js";
import { registerVerificationTools } from "./verification.js";
import { registerStablecoinTools } from "./stablecoin.js";

export function registerTools() {
  registerRequiredTools();
  registerTransactionTools();
  registerCheckoutTools();
  registerPlanTools();
  registerTransferTools();
  registerChargeTools();
  registerVirtualAccountTools();
  registerBillPaymentTools();
  registerFxTradeTools();
  registerVerificationTools();
  registerStablecoinTools();
}