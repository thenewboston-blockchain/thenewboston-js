import { ServerNode } from "./server-node";
import type { PaginationOptions } from "./models";

export class Validator extends ServerNode {
  async getAccounts(options: Partial<PaginationOptions> = {}) {
    return await this.getPaginatedData("/accounts", options);
  }

  async getAccountBalance(id: string) {
    return await this.getData(`/accounts/${id}/balance`);
  }

  async getAccountBalanceLock(id: string) {
    return await this.getData(`/accounts/${id}/balance_lock`);
  }

  async getBanks(options: Partial<PaginationOptions> = {}) {
    return await this.getPaginatedData("/banks", options);
  }

  async getConfig() {
    return await this.getData("/config");
  }

  async getQueuedConfirmationBlock(id: string) {
    return await this.getData(`/confirmation_blocks/${id}/queued`);
  }

  async getValidConfirmationBlock(id: string) {
    return await this.getData(`/confirmation_blocks/${id}/valid`);
  }

  async getValidators(options: Partial<PaginationOptions> = {}) {
    return await this.getPaginatedData(`/validators`, options);
  }
}
