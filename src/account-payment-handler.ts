import type { Account } from "./account";
import type { AccountPaymentHandlerOptions, Transaction } from "./models";
import { PaymentHandler } from "./payment-handler";
import { TransferDetails } from "./utils";

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

  async sendCoins(recipient: Account | string, amount: number, memo = "") {
    return await this.client.sendCoins(new TransferDetails(this.account, recipient, amount, memo));
  }

  async sendBulkTransactions(transactions: Transaction[]) {
    return await this.client.sendBulkTransactions(this.account, transactions);
  }
}
