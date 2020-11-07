const Validator = require("../validator");

class PrimaryValidator extends Validator {
  constructor(url, options = {}) {
    super(url, options);
  }

  // TODO: POST /bank_blocks

  // TODO: POST /connection_requests
}

module.exports = PrimaryValidator;
