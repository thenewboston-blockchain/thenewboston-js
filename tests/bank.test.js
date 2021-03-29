const tnb = require("../");

describe("Bank", () => {
  it("constructor()", async () => {
    const bank = new tnb.Bank("http://13.57.215.62", { defaultPagination: { limit: 2, offset: 10 } });
    expect(bank.url).toBe("http://13.57.215.62");
    expect(bank.options).toStrictEqual({ defaultPagination: { limit: 2, offset: 10 } });
  });

  it("getTransactions()", async () => {
    const bank = new tnb.Bank("http://13.57.215.62");
    const transactions = await bank.getTransactions();
    expect(transactions).toBeTruthy();
  });

  it("getBanks()", async () => {
    const bank = new tnb.Bank("http://13.57.215.62");
    const banks = await bank.getBanks();
    expect(banks).toBeTruthy();
  });

  it("getBlocks()", async () => {
    const bank = new tnb.Bank("http://13.57.215.62");
    const blocks = await bank.getBlocks();
    expect(blocks).toBeTruthy();
  });

  it("getConfig()", async () => {
    const bank = new tnb.Bank("http://13.57.215.62");
    const config = await bank.getConfig();
    expect(config).toBeTruthy();
  });

  it("getConfirmationBlocks()", async () => {
    const bank = new tnb.Bank("http://13.57.215.62");
    const confirmationBlocks = await bank.getConfirmationBlocks();
    expect(confirmationBlocks).toBeTruthy();
  });

  it("getInvalidBlocks()", async () => {
    const bank = new tnb.Bank("http://13.57.215.62");
    const invalidBlocks = await bank.getInvalidBlocks();
    expect(invalidBlocks).toBeTruthy();
  });

  it("getValidatorConfirmationServices()", async () => {
    const bank = new tnb.Bank("http://13.57.215.62");
    const validatorConfirmationServices = await bank.getValidatorConfirmationServices();
    expect(validatorConfirmationServices).toBeTruthy();
  });

  it("getValidators()", async () => {
    const bank = new tnb.Bank("http://13.57.215.62");
    const validators = await bank.getValidators();
    expect(validators).toBeTruthy();
  });

  it("getBankPV()", async () => {
    const bank = new tnb.Bank("http://13.57.215.62");
    const pv = await bank.getBankPV();
    expect(pv).toBeTruthy();
  });

  it("getTxFee()", async () => {
    const bank = new tnb.Bank("http://13.57.215.62");
    const txFee = await bank.getTxFee();
    expect(typeof txFee).toBe("number");
  });
});
