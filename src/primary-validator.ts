import { Validator } from "./validator";
import type { ServerNodeOptions } from "./models";

export class PrimaryValidator extends Validator {
  constructor(url: string, options: Partial<ServerNodeOptions> = {}) {
    super(url, options);
  }

  // TODO: POST /bank_blocks

  // TODO: POST /connection_requests
}
