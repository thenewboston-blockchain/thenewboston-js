import type { Account } from "./account";
import type { AccountPaymentHandlerOptions } from "./models";
import { PaymentHandler } from "./payment-handler";

export class AccountPaymentHandler {
  private client: PaymentHandler;
  private account: Account;

  constructor({ account, bankUrl }: AccountPaymentHandlerOptions) {
    this.account = account;
    this.client = new PaymentHandler({ bankUrl });
  }

  async init() {
    await this.client.init();
  }

  async sendCoins(recipient: Account | string, amount: number) {
    const transaction = await this.client.createTransaction(this.account, recipient, amount);
    await this.client.broadcastTransaction(transaction);
  }
}
