import { ServerNode } from "./server-node";
import type {
  AccountBalanceResponse,
  AccountBalanceLockResponse,
  PaginatedBankEntry,
  PaginatedTransactionEntry,
  PaginationOptions,
} from "./models";

/**
 * Used as a base for all types of validator nodes.
 *
 * Note: this class is meant to be extended.
 */
export abstract class Validator extends ServerNode {
  /** Gets all of the banks connected to the current validator. */
  async getBanks(options: Partial<PaginationOptions> = {}) {
    return await super.getPaginatedData<PaginatedBankEntry>("/banks", options);
  }

  /**
   * Gets the account balance with the given account number (id).
   * @param id the account number
   */
  async getAccountBalance(id: string) {
    return await super.getData<AccountBalanceResponse>(`/accounts/${id}/balance`);
  }

  /**
   * Gets the balance lock of the given account.
   * @param id the id of the account
   */
  async getAccountBalanceLock(id: string) {
    return await super.getData<AccountBalanceLockResponse>(`/accounts/${id}/balance_lock`);
  }

  /**
   * Gets the details of given block identifier's queued transactions.
   * @param id the block identifier
   */
  async getQueuedConfirmationBlock(id: string) {
    return await super.getData(`/confirmation_blocks/${id}/queued`);
  }

  /**
   * Gets the details of given block identifier's valid transactions.
   * @param id the block identifier
   */
  async getValidConfirmationBlock(id: string) {
    return await super.getData(`/confirmation_blocks/${id}/valid`);
  }

  /**
   * Gets all of the connected validators to the current validator.
   * @param options the pagination options
   */
  async getValidators(options: Partial<PaginationOptions> = {}) {
    return await super.getPaginatedData<PaginatedTransactionEntry>(`/validators`, options);
  }
}
