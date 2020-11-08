const { Bank, PrimaryValidator, ConfirmationValidator } = require("./");

async function main() {
  {
    const bank = new Bank("http://143.110.137.54");
    // All paginated endpoints can have a `limit` and `offset` key/value pair in the optional object
    await bank.getAccounts({ limit: "asdf" });
    await bank.getTransactions();
    await bank.getBanks();
    await bank.getBlocks({ offset: 32 });
    await bank.getConfig();
    await bank.getConfirmationBlocks();
    await bank.getInvalidBlocks();
    await bank.getValidatorConfirmationServices();
    await bank.getValidators();
  }

  // both primary and confirmation validators extend the validator class, because almost all of the methods are the same

  {
    const primaryValidator = new PrimaryValidator("http://54.183.17.224/");
    await primaryValidator.getAccounts();
    await primaryValidator.getAccountBalance(
      "d84543947090d300910f8d1b9604c0c0a56fafca6cfbe52511c1e31757188bca"
    );
    await primaryValidator.getAccountBalanceLock(
      "d84543947090d300910f8d1b9604c0c0a56fafca6cfbe52511c1e31757188bca"
    );
    await primaryValidator.getBanks();
    await primaryValidator.getConfig();
    // these require the block ids
    // await primaryValidator.getQueuedConfirmationBlock();
    // await primaryValidator.getValidConfirmationBlock();
    await primaryValidator.getValidators();
  }

  {
    const confirmationValidator = new ConfirmationValidator(
      "http://54.183.17.224/"
    );
    await confirmationValidator.getBankConfirmationServices();
  }
}

main();
