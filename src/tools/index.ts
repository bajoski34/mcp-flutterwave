import {registerCheckoutTools} from './checkout.js';
import { registerTransactionTools } from './transaction.js';
import { registerRequiredTools } from './required.js';
import { registerPlanTools } from './plan.js';

export function registerTools() {
  registerRequiredTools();
  registerTransactionTools();
  registerCheckoutTools();
  registerPlanTools();
}