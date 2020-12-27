import type { PaymentHandlerOptions } from "./payment-handler-options";
import type { Account } from "../account";

export interface AccountPaymentHandlerOptions extends PaymentHandlerOptions {
  account: Account;
}
