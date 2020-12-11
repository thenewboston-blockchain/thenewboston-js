import { Validator } from "./validator";
import type { Account } from "./account";
import type {  ConfirmationValidatorConfigResponse } from "./models";

/** Used for connecting with and using confirmation validator server nodes. */
export class ConfirmationValidator extends Validator {
  /** Gets the current confirmation confirmation validator's listed services. */
  async getBankConfirmationServices() {
    return await this.getData("/bank_confirmation_services");
  }

  // TODO: POST /confirmation_blocks

  // TODO: POST /connection_requests

  /**
   * Sends a notification to the bank that a primary validator has left the network.
   * @param ipAddress the ip address of the primary validator that is leaving
   * @param port the port that the primary validator is on
   * @param protocol the protocol of the primary validator
   * @param serverAccount the account that the current `ConfirmationValidator` is connected to
   */
  async sendPrimaryValidatorUpdatedPing(ipAddress: string, port: string, protocol: string, serverAccount: Account) {
    return await this.postData(
      "/primary_validator_updated",
      serverAccount.createSignedMessage({ ip_address: ipAddress, port, protocol })
    );
  }

  // TODO: POST /upgrade_request

  /**
   * Gets the current confirmation validator's config data.
   */
  async getConfig() {
    return await this.getData<ConfirmationValidatorConfigResponse>("config")
  }
}
