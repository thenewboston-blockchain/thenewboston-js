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
    const { ip_address: ip, port, protocol } = this.bankConfig?.primary_validator!;
    let url = `${protocol}://${ip}`;
    if (port !== null) {
      url += `:${port}`;
    }
    this.primaryValidator = new PrimaryValidator(url);
    const config = await this.primaryValidator
      .getConfig()
      .catch((err) => throwError("Failed to load the primary validator's config.", err));
    this.primaryValidatorConfig = config;
  }

  /**
   * Creates a transaction with a specific amount of coins to a given account from the sender.
   * @param transferDetails The object with transfer details like sender, recipient and amount
   */
  async createTransaction({ sender, recipient, amount }: TransferDetails) {
    const { balance_lock: balanceLock } = await this.primaryValidator!.getAccountBalanceLock(
      sender.accountNumberHex
    ).catch((err) =>
      throwError(`Failed to load the balance lock from the primary validator to send the transaction.`, err)
    );

    const transactions: Transaction[] = [
      {
        amount,
        recipient: typeof recipient === "string" ? recipient : recipient.accountNumberHex,
      },
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
  async sendCoins(transferDetails: TransferDetails) {
    const transaction = await this.createTransaction(transferDetails);
    await this.broadcastTransaction(transaction);
  }
}
