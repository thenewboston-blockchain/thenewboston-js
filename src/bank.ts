import { ServerNode } from "./server-node";
import type {
  PaginationOptions,
  BankConfigResponse,
  Transaction,
  PaginatedTransactionEntry,
  PaginatedEntry,
  PaginatedBankEntry,
  PaginatedEntryMetadata,
  PaginatedBlockEntry,
  PaginatedValidatorEntry,
} from "./models";
import type { Account } from "./account";

/** Used for creating banks and sending requests easily to that specific bank server node. */
export class Bank extends ServerNode {
  /**
   * Updates the given server account's trust on the bank.
   * @param accountNumber the account number of the server to update
   * @param trust the trust of the the server
   * @param account the account for the server node in which the account number is the node identifier and the signing key is the node identifier signing key
   */
  async updateAccount(accountNumber: string, trust: number, account: Account) {
    return await super.patchData(`/accounts/${accountNumber}`, account.createSignedMessage({ trust }));
  }

  /**
   * Gets the transactions for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getTransactions(options: Partial<PaginationOptions> = {}) {
    return await super.getPaginatedData<PaginatedTransactionEntry & PaginatedEntry>("/bank_transactions", options);
  }

  /**
   * Gets the connected banks for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getBanks(options: Partial<PaginationOptions> = {}) {
    return await super.getPaginatedData<PaginatedBankEntry>("/banks", options);
  }

  /**
   * Updates a given bank's trust.
   * @param nodeIdentifier the bank to update's node identifier
   * @param trust the new bank's trust
   * @param account the account to sign the request
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
   * Gets the blocks for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getBlocks(options: Partial<PaginationOptions> = {}) {
    return await super.getPaginatedData<PaginatedBlockEntry & PaginatedEntryMetadata>("/blocks", options);
  }

  /**
   * Adds new transaction blocks to the blockchain.
   * @param balanceLock the current balance lock
   * @param transactions the transactions to push to the block chain
   * @param account the account that is sending the transactions
   */
  async addBlocks(balanceLock: string, transactions: Transaction[], account: Account) {
    return await super.postData("/blocks", account.createBlockMessage(balanceLock, transactions));
  }

  /**
   * Gets the current bank's config data.
   */
  async getConfig() {
    return await super.getData<BankConfigResponse>("/config");
  }

  /**
   * Gets the confirmation blocks for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getConfirmationBlocks(options: Partial<PaginationOptions> = {}) {
    return await super.getPaginatedData("/confirmation_blocks", options);
  }

  // TODO: POST /confirmation_blocks

  /**
   * Gets the invalid blocks for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getInvalidBlocks(options: Partial<PaginationOptions> = {}) {
    return await super.getPaginatedData("/invalid_blocks", options);
  }

  /**
   * Gets the validator confirmation services for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getValidatorConfirmationServices(options: Partial<PaginationOptions> = {}) {
    return await super.getPaginatedData("/validator_confirmation_services", options);
  }

  /**
   * Updates the validator's confirmation services data.
   * @param start the validator's services start date
   * @param end the validator's services end date
   * @param account the server's account to validate the requests
   */
  async updateValidatorConfirmationServices(start: string, end: string, account: Account) {
    return await super.postData(
      "/validator_confirmation_services",
      account.createSignedMessage({
        start,
        end,
      })
    );
  }

  /**
   * Sends a signed POST request to the bank for an upgrade notice.
   * @param nodeIdentifier the node identifier of the bank that is receiving the upgrade notice
   * @param account the current bank server's account
   */
  async sendUpgradeNotice(nodeIdentifier: string, account: Account) {
    return await super.postData(
      "/upgrade_notice",
      account.createSignedMessage({ bank_node_identifier: nodeIdentifier })
    );
  }

  /**
   * Gets all of the validators for the current bank.
   * @param options The optional object for the pagination options.
   */
  async getValidators(options: Partial<PaginationOptions> = {}) {
    return await super.getPaginatedData<PaginatedValidatorEntry>("/validators", options);
  }
}
