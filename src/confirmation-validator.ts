import { Validator } from "./validator";
import type { Account } from "./account";
import type { ConfirmationValidatorConfigResponse, PaginatedResponse } from "./models";

/** Used for connecting with and using confirmation validator server nodes. */
export class ConfirmationValidator extends Validator {
  /** Gets the current confirmation confirmation validator's listed services. */
  async getBankConfirmationServices() {
    return await super.getData("/bank_confirmation_services");
  }

  // TODO: POST /confirmation_blocks

  /**
   * Sends a notification to the bank that a primary validator has left the network.
   * @param ipAddress the ip address of the primary validator that is leaving
   * @param port the port that the primary validator is on
   * @param protocol the protocol of the primary validator
   * @param account the account that the current `ConfirmationValidator` is connected to
   */
  async sendPrimaryValidatorUpdatedPing(ipAddress: string, port: string, protocol: string, account: Account) {
    return await super.postData(
      "/primary_validator_updated",
      account.createSignedMessage({ ip_address: ipAddress, port, protocol })
    );
  }

  /**
   * Sends a signed POST request to the confirmation validator for an upgrade request.
   * @param nodeIdentifier the node identifier of the confirmation validator that is receiving the upgrade notice
   * @param account the current confirmation validator server's account
   */
  async sendUpgradeRequest(nodeIdentifier: string, account: Account) {
    return await super.postData(
      "/upgrade_request",
      account.createSignedMessage({ validator_node_identifier: nodeIdentifier })
    );
  }

  /** Gets the current confirmation validator's config data. */
  async getConfig() {
    return super._getConfig<ConfirmationValidatorConfigResponse>();
  }
}
