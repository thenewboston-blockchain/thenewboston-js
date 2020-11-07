const ServerNode = require("../server-node");

class Validator extends ServerNode {
  constructor(url, options = {}) {
    super(url, options);
  }

  async getAccounts(options = {}) {
    return await this.getPaginatedData("/accounts", options);
  }

  async getAccountBalance(id) {
    return await this.getData(`/accounts/${id}/balance`);
  }

  async getAccountBalanceLock(id) {
    return await this.getData(`/accounts/${id}/balance_lock`);
  }

  async getBanks(options = {}) {
    return await this.getPaginatedData("/banks", options);
  }

  async getConfig() {
    return await this.getData("/config");
  }

  async getQueuedConfirmationBlock(id) {
    return await this.getData(`/confirmation_blocks/${id}/queued`);
  }

  async getValidConfirmationBlock(id) {
    return await this.getData(`/confirmation_blocks/${id}/valid`);
  }

  async getValidators(options = {}) {
    return await this.getPaginatedData(`/validators`, options);
  }
}

module.exports = Validator;
