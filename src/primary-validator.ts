import type { PrimaryValidatorConfigResponse } from "./models";
import { Validator } from "./validator";

/** Used for connecting with and using primary validator server nodes. */
export class PrimaryValidator extends Validator {
  // TODO: POST /bank_blocks

  /** Gets the config of the current primary validator server. */
  async getConfig() {
    return super._getConfig<PrimaryValidatorConfigResponse>();
  }
}
