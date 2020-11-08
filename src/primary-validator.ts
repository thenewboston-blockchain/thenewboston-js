import { Validator } from "./validator";

export class PrimaryValidator extends Validator {
  constructor(url: string, options = {}) {
    super(url, options);
  }

  // TODO: POST /bank_blocks

  // TODO: POST /connection_requests
}
