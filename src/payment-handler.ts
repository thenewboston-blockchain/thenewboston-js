import type { Account } from "./account";
import { Bank } from "./bank";
import { PrimaryValidator } from "./primary-validator";
import type { BankConfigResponse, PrimaryValidatorConfigResponse, Transaction } from "./models";
import { throwError } from "./utils";

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
    this.primaryValidatorConfig = config as PrimaryValidatorConfigResponse;
  }

  /**
   * Sends a specific amount of coins to a given account from the sender.
   * @param sender the authenticated account which is sending the coins
   * @param recipient the account number or `Account` of the recipient recieving the coins
   * @param amount the amount of coins to send
   */
  async sendCoins(sender: Account, recipient: Account | string, amount: number) {
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
    ];

    if (this.bankConfig) {
      transactions.push({
        amount: this.bankConfig.default_transaction_fee,
        recipient: this.bankConfig.account_number,
      });
    } else {
      console.error(
        "Failed to use the bank's config for paying the transaction fees. Did you run the `init` method before using the class?"
      );
    }

    if (this.primaryValidatorConfig) {
      transactions.push({
        amount: this.primaryValidatorConfig.default_transaction_fee,
        recipient: this.primaryValidatorConfig.account_number,
      });
    } else {
      console.error(
        "Failed to use the bank's config for paying the transaction fees. Did you run the `init` method before using the class?"
      );
    }

    await this.bank.addBlocks(balanceLock, transactions, sender);
  }
}
