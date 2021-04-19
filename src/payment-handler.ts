import type { Account } from "./account";
import { Bank } from "./bank";
import { PrimaryValidator } from "./primary-validator";
import type { BankConfigResponse, PrimaryValidatorConfigResponse, Transaction } from "./models";
import { throwError, TransferDetails } from "./utils";

export interface PaymentHandlerOptions {
  bankUrl: string;
}
export class PaymentHandler {
  private bank: Bank;
  private bankConfig?: BankConfigResponse;
  private primaryValidator?: PrimaryValidator;
  private primaryValidatorConfig?: PrimaryValidatorConfigResponse;

  constructor({ bankUrl }: PaymentHandlerOptions) {
    this.bank = new Bank(bankUrl);
  }

  /** This must be ran before using the client. */
  async init() {
    await this.updateBank();
    await this.updatePrimaryValidator();
  }

  async updateBank() {
    const config = await this.bank.getConfig().catch((err) => throwError("Failed to load the bank's config.", err));
    this.bankConfig = config; // it has to be correct if it got this far without the error
  }

  async updatePrimaryValidator() {
    if (!this.bankConfig) {
      return;
    }

    this.primaryValidator = await this.bank.getBankPV();

    const config = await this.primaryValidator
      .getConfig()
      .catch((err) => throwError("Failed to load the primary validator's config.", err));
    this.primaryValidatorConfig = config;
  }

  /**
   * Creates a transaction with a specific amount of coins to a given account from the sender.
   * @param sender Theobject with the sender's account details
   * @param txs An array with multiple transactions with details of the amount and recipient
   *
   */
  async createTransaction(sender: Account, txs: Transaction[]) {
    txs = txs.map((tx) => {
      if (tx.memo) {
        tx.memo = tx.memo.trim();
        if (!/^[a-zA-Z0-9_ ]*$/.test(tx.memo))
          throwError("Invalid memo", "Memo can only contain alphanumeric characters, spaces, and underscores");
        if (tx.memo.length > 64) throwError("Invalid memo", "Memo cannot exceed 64 characters");
      }
      if (tx.memo === "") delete tx.memo;
      return tx;
    });

    const { balance_lock: balanceLock } = await this.primaryValidator!.getAccountBalanceLock(
      sender.accountNumberHex
    ).catch((err) =>
      throwError(`Failed to load the balance lock from the primary validator to send the transaction.`, err)
    );

    const transactions: Transaction[] = [
      ...txs,
      ...[this.bankConfig!, this.primaryValidatorConfig!].map((config) => ({
        amount: config.default_transaction_fee,
        fee: config.node_type,
        recipient: config.account_number,
      })),
    ];
    return { balanceLock, transactions, sender };
  }

  /**
   * Sends a specific amount of coins to a given account from the sender.
   * @param transaction the object containing transaction details
   */
  async broadcastTransaction(transaction: {
    balanceLock: string | null;
    transactions: Transaction[];
    sender: Account;
  }) {
    await this.bank.addBlocks(transaction.balanceLock!, transaction.transactions, transaction.sender);
  }

  /**
   * Sends a specific amount of coins to a given account from the sender.
   * @param transferDetails The object with transfer details like sender, recipient and amount
   */
  async sendCoins({ sender, recipient, amount, memo = "" }: TransferDetails) {
    const recipientAccount = typeof recipient === "string" ? recipient : recipient.accountNumberHex;
    const transaction = await this.createTransaction(sender, [{ amount, memo, recipient: recipientAccount }]);
    await this.broadcastTransaction(transaction);
  }

  /**
   * Sends multiple amounts of coins to multiple recipients.
   * @param sender Theobject with the sender's account details
   * @param txs An array with multiple transactions with details of the amount and recipient
   */
  async sendBulkTransactions(sender: Account, txs: Transaction[]) {
    const transaction = await this.createTransaction(sender, txs);
    await this.broadcastTransaction(transaction);
  }
}
