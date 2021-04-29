import { Account } from "./account";
import { ServerNode } from "./server-node";
import type {
  AccountBalanceResponse,
  AccountBalanceLockResponse,
  PaginatedBankEntry,
  PaginatedValidatorEntry,
  PaginatedTransactionEntry,
  PaginationOptions,
  ConfirmationBlock,
} from "./models";

/**
 * Used as a base for all types of validator nodes.
 *
 * Note: this class is meant to be extended.
 */
export abstract class Validator extends ServerNode {
  /**
   * Gets the bank with the specified node identifier.
   * @param nodeIdentifier Node Identifier of a bank.
   */
  async getBank(nodeIdentifier: string) {
    return await super.getData<PaginatedBankEntry>(`/banks/${nodeIdentifier}`);
  }

  /** Gets all of the banks connected to the current validator. */
  async getBanks(options: Partial<PaginationOptions> = {}) {
    return await super.getPaginatedData<PaginatedBankEntry>("/banks", options);
  }

  /**
   * Gets the account balance with the given account number (id).
   * @param accountNumber the public key of the account
   */
  async getAccountBalance(accountNumber: string) {
    return await super.getData<AccountBalanceResponse>(`/accounts/${accountNumber}/balance`);
  }

  /**
   * Gets the balance lock of the given account.
   * @param accountNumber the public key of the account
   */
  async getAccountBalanceLock(accountNumber: string) {
    return await super.getData<AccountBalanceLockResponse>(`/accounts/${accountNumber}/balance_lock`);
  }

  /**
   * Gets the details of given block identifier's queued transactions.
   * @param blockId the block identifier
   */
  async getQueuedConfirmationBlock(blockId: string) {
    return await super.getData<ConfirmationBlock>(`/confirmation_blocks/${blockId}/queued`);
  }

  /**
   * Gets the details of given block identifier's valid transactions.
   * @param blockId the block identifier
   */
  async getValidConfirmationBlock(blockId: string) {
    return await super.getData<ConfirmationBlock>(`/confirmation_blocks/${blockId}/valid`);
  }

  /**
   * Gets the validator with the specified node identifier.
   * @param nodeIdentifier Node Identifier of a validator.
   */
  async getValidator(nodeIdentifier: string) {
    return await super.getData<PaginatedValidatorEntry>(`/validators/${nodeIdentifier}`);
  }

  /**
   * Gets all of the connected validators to the current validator.
   * @param options the pagination options
   */
  async getValidators(options: Partial<PaginationOptions> = {}) {
    return await super.getPaginatedData<PaginatedValidatorEntry>(`/validators`, options);
  }
  /**
   * Updates a given bank's trust.
   * @param nodeIdentifier the bank to update's node identifier
   * @param trust the new bank's trust
   * @param account the current validators's network Id to sign the request
   */
  async updateBankTrust(nodeIdentifier: string, trust: number, account: Account) {
    return await super.patchData(
      `/banks/${nodeIdentifier}`,
      account.createSignedMessage({
        trust,
      })
    );
  }

  /**
   * Updates a given validators's trust.
   * @param nodeIdentifier the validator to update's node identifier
   * @param trust the new validator's trust
   * @param account the current validators's network Id to sign the request
   */
  async updateValidatorTrust(nodeIdentifier: string, trust: number, account: Account) {
    return await super.patchData(
      `/validators/${nodeIdentifier}`,
      account.createSignedMessage({
        trust,
      })
    );
  }
}
