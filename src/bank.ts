import { ServerNode } from "./server-node";
import type { PaginationOptions, BankConfigResponse, Transaction } from "./models";
import type { Protocol } from "./models/responses/constants";
import { Account } from "./account";

/** Used for creating banks and sending requests easily to that specific bank server node. */
export class Bank extends ServerNode {
  /**
   * Gets the accounts for the given bank in a paginated format.
   * @param options The optional object for the pagination options.
   */
  async getAccounts(options: Partial<PaginationOptions> = {}) {
    return await this.getPaginatedData("/accounts", options);
  }

  /**
   * Updates the given server account's trust on the bank.
   * @param accountNumber the account number of the server to update
   * @param trust the trust of the the server
   * @param serverAccount the account for the server node in which the account number is the node identifier and the signing key is the node identifier signing key
   */
  async updateAccount(accountNumber: string, trust: number, serverAccount: Account) {
    return await this.patchData(`/accounts/${accountNumber}`, serverAccount.createSignedMessage({ trust }));
  }

  /**
   * Gets the transactions for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getTransactions(options: Partial<PaginationOptions> = {}) {
    return await this.getPaginatedData("/bank_transactions", options);
  }

  /**
   * Gets the connected banks for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getBanks(options: Partial<PaginationOptions> = {}) {
    return await this.getPaginatedData("/banks", options);
  }

  /**
   * Updates a given bank's trust.
   * @param nodeIdentifier the bank to update's node identifier
   * @param trust the new bank's trust
   * @param serverAccount the account to sign the request
   */
  async updateBankTrust(nodeIdentifier: string, trust: number, serverAccount: Account) {
    return await this.patchData(
      `/banks/${nodeIdentifier}`,
      serverAccount.createSignedMessage({
        trust,
      })
    );
  }

  /**
   * Gets the blocks for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getBlocks(options: Partial<PaginationOptions> = {}) {
    return await this.getPaginatedData("/blocks", options);
  }

  /**
   * Adds new transaction blocks to the blockchain.
   * @param balanceLock the current balance lock
   * @param transactions the transactions to push to the block chain
   * @param account the account that is sending the transactions
   */
  async addBlocks(balanceLock: string, transactions: Transaction[], account: Account) {
    return await this.postData("/blocks", account.createBlockMessage(balanceLock, transactions));
  }

  /**
   * Gets the current bank's config data.
   */
  async getConfig() {
    return await this.getData<BankConfigResponse>("/config");
  }

  /**
   * Gets the confirmation blocks for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getConfirmationBlocks(options: Partial<PaginationOptions> = {}) {
    return await this.getPaginatedData("/confirmation_blocks", options);
  }

  // TODO: POST /confirmation_blocks

  /**
   * Gets the invalid blocks for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getInvalidBlocks(options: Partial<PaginationOptions> = {}) {
    return await this.getPaginatedData("/invalid_blocks", options);
  }

  /**
   * Sends a connection request to this current bank with the data about the new server.
   * @param ipAddress the new bank's ip address
   * @param port the new bank's port
   * @param protocol the new bank's protocol
   * @param serverAccount the server account to validate the request
   */
  async sendConnectionRequest(ipAddress: string, port: string, protocol: Protocol, serverAccount: Account) {
    return await this.postData(
      "/connection_requests",
      serverAccount.createSignedMessage({
        ip_address: ipAddress,
        port,
        protocol,
      })
    );
  }

  /**
   * Gets the validator confirmation services for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getValidatorConfirmationServices(options: Partial<PaginationOptions> = {}) {
    return await this.getPaginatedData("/validator_confirmation_services", options);
  }

  // TODO: POST /validator_confirmation_services

  /**
   * Sends a signed POST request to the bank for an upgrade notice.
   * @param nodeIdentifier the node identifier of the bank that is receiving the upgrade notice
   * @param bankAccount the current bank server's account
   */
  async sendUpgradeNotice(nodeIdentifier: string, bankAccount: Account) {
    return await this.postData(
      "/upgrade_notice",
      bankAccount.createSignedMessage({ bank_node_identifier: nodeIdentifier })
    );
  }

  /**
   * Sends a signed POST request to the confirmation validator for an upgrade request.
   * @param nodeIdentifier the node identifier of the confirmation validator that is receiving the upgrade notice
   * @param validatorAccount the current confirmation validator server's account
   */
  async sendUpgradeRequest(nodeIdentifier: string, validatorAccount: Account): Promise<any> {
    return await this.postData(
      "/upgrade_request",
      validatorAccount.createSignedMessage({ node_identifier: nodeIdentifier })
    );
  }

  /**
   * Gets all of the validators for the current bank.
   * @param options The optional object for the pagination options.
   */
  async getValidators(options: Partial<PaginationOptions> = {}) {
    return await this.getPaginatedData("/validators", options);
  }

  // TODO: PATCH /validators/<node_identifier>
}
