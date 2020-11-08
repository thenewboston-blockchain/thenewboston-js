import { ServerNode } from "./server-node";

export class Bank extends ServerNode {
  constructor(url: string, options = {}) {
    super(url, options);
  }

  /**
   * Gets the accounts for the given bank in a paginated format.
   * @param options The optional object for the pagination options.
   */
  async getAccounts(options = {}) {
    return await this.getPaginatedData("/accounts", options);
  }

  // TODO: PATCH  /accounts/<account_number>

  /**
   * Gets the transactions for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getTransactions(options = {}) {
    return await this.getPaginatedData("/bank_transactions", options);
  }

  /**
   * Gets the connected banks for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getBanks(options = {}) {
    return await this.getPaginatedData("/banks", options);
  }

  // TODO: PATCH /banks/<node_identifier>

  /**
   * Gets the blocks for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getBlocks(options = {}) {
    return await this.getPaginatedData("/blocks", options);
  }

  // TODO: POST /blocks

  /**
   * Gets the current bank's config data.
   */
  async getConfig() {
    return await this.getData("/config");
  }

  /**
   * Gets the confirmation blocks for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getConfirmationBlocks(options = {}) {
    return await this.getPaginatedData("/confirmation_blocks", options);
  }

  // TODO: POST /confirmation_blocks

  /**
   * Gets the invalid blocks for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getInvalidBlocks(options = {}) {
    return await this.getPaginatedData("/invalid_blocks", options);
  }

  // TODO: POST /confirmation_blocks

  // TODO: POST /connection_requests

  /**
   * Gets the validator confirmation services for the given bank.
   * @param options The optional object for the pagination options.
   */
  async getValidatorConfirmationServices(options = {}) {
    return await this.getPaginatedData(
      "/validator_confirmation_services",
      options
    );
  }

  // TODO: POST /validator_confirmation_services

  // TODO: POST /upgrade_notice

  /**
   * Gets all of the validators for the current bank.
   * @param options The optional object for the pagination options.
   */
  async getValidators(options = {}) {
    return await this.getPaginatedData("/validators", options);
  }

  // TODO: PATCH /validators/<node_identifier>
}
