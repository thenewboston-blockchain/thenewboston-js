import { ServerNode } from "./server-node";
import type { PaginationOptions } from "./models";
import type { Account } from "./account";
import type { Protocol } from "./models/responses/constants";
/**
 * Used as a base for all types of validator nodes.
 *
 * Note: this class is meant to be extended.
 */
export abstract class Validator extends ServerNode {
  /** Gets all of the banks connected to the current validator. */
  async getBanks(options: Partial<PaginationOptions> = {}) {
    return await this.getPaginatedData("/banks", options);
  }

  /** Gets the current config data for the current validator. */
  async getConfig() {
    return await this.getData("/config");
  }

  /**
   * Gets the details of given block identifier's queued transactions.
   * @param id the block identifier
   */
  async getQueuedConfirmationBlock(id: string) {
    return await this.getData(`/confirmation_blocks/${id}/queued`);
  }

  /**
   * Gets the details of given block identifier's valid transactions.
   * @param id the block identifier
   */
  async getValidConfirmationBlock(id: string) {
    return await this.getData(`/confirmation_blocks/${id}/valid`);
  }

  /**
   * Gets all of the connected validators to the current validator.
   * @param options the pagination options
   */
  async getValidators(options: Partial<PaginationOptions> = {}) {
    return await this.getPaginatedData(`/validators`, options);
  }
}
