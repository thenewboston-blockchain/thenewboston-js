import { Validator } from "./validator";

/** Used for connecting with and using confirmation validator server nodes. */
export class ConfirmationValidator extends Validator {
  /** Gets the current confirmation confirmation validator's listed services. */
  async getBankConfirmationServices() {
    return await this.getData("/bank_confirmation_services");
  }

  // TODO: POST /confirmation_blocks

  // TODO: POST /connection_requests

  // TODO: POST /primary_validator_updated

  // TODO: POST /upgrade_request
}
