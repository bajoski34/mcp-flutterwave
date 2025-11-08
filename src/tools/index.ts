import {registerCheckoutTools} from './checkout.js';
import { registerTransactionTools } from './transaction.js';
import { registerRequiredTools } from './required.js';
import { registerPlanTools } from './plan.js';
import {registerTransferTools} from "./transfer.js";

export function registerTools() {
  registerRequiredTools();
  registerTransactionTools();
  registerCheckoutTools();
  registerPlanTools();
  registerTransferTools();
}