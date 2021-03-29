import type { PrimaryValidatorConfigResponse } from "./models";
import { Validator } from "./validator";
import { Transaction } from "./models";
import { Account } from "./account";

/** Used for connecting with and using primary validator server nodes. */
export class PrimaryValidator extends Validator {
  /** Gets the config of the current primary validator server. */
  async getConfig() {
    return super._getConfig<PrimaryValidatorConfigResponse>();
  }

  /**
   * Bank blocks would need to be signed by the bank indicating tha the block has passed the validation.
   * @param balanceLock the current balance lock
   * @param transactions the transactions to push to the block chain
   * @param account the account that is sending the transactions
   */
  async addBankBlocks(balanceLock: string, transactions: Transaction[], account: Account) {
    return await this.postData("/bank_blocks", account.createBlockMessage(balanceLock, transactions));
  }

  /**
   * Get transaction fee of the current Primary Validator
   */
  async getTxFee() {
    return (await this.getConfig()).default_transaction_fee;
  }
}
