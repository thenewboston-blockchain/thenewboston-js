const tnb = require("../");
const nock = require("nock");
const data = require("./data/bank");

describe("Bank", () => {
  beforeAll(() => {
    nock("http://13.57.215.62")
      .get("/bank_transactions")
      .query({ limit: 20, offset: 0 })
      .reply(200, data.bank_transactions);
  });
  afterAll(() => nock.cleanAll());

  const bank = new tnb.Bank("http://13.57.215.62");

  it("constructor()", async () => {
    const bank = new tnb.Bank("http://13.57.215.62", { defaultPagination: { limit: 2, offset: 10 } });
    expect(bank.url).toBe("http://13.57.215.62");
    expect(bank.options).toStrictEqual({ defaultPagination: { limit: 2, offset: 10 } });
  });

  it("getTransactions()", async () => {
    const transactions = await bank.getTransactions();
    expect(typeof transactions).toBe("object");
    expect(transactions.results[0]).toStrictEqual({
      id: "a486f2ca-2431-455a-bdb2-6dccbf7e1ace",
      block: {
        id: "30b5bafb-139c-43ad-a03f-8c04e77c35a2",
        created_date: "2021-03-30T03:38:45.827858Z",
        modified_date: "2021-03-30T03:38:45.827884Z",
        balance_key: "43731d388391f5a8b046066a4a3cf6164b16192a99fcd00bdeb627a98d31016e",
        sender: "7c2d3b7774b494a496c00d175bd68d04280acb3fd1bac5dc46cae2b67d7f5a4f",
        signature:
          "d8b6d6f56149519d26ebb901702c078a0b75b4f153a84655f1a1b161c52aff65086c3a0195e91ee8504790cbc699d7f8189c680aa89d609b5d12101d7190d407",
      },
      amount: 1,
      fee: "BANK",
      recipient: "9a275161478536d0a5b88ff05d429b9a9e63d0032a46e7a6a8f088da89c69da5",
    });
  });

  it("getBanks()", async () => {
    const banks = await bank.getBanks();
    expect(banks).toBeTruthy();
  });

  it("getBlocks()", async () => {
    const blocks = await bank.getBlocks();
    expect(blocks).toBeTruthy();
  });

  it("getConfig()", async () => {
    const config = await bank.getConfig();
    expect(config).toBeTruthy();
  });

  it("getConfirmationBlocks()", async () => {
    const confirmationBlocks = await bank.getConfirmationBlocks();
    expect(confirmationBlocks).toBeTruthy();
  });

  it("getInvalidBlocks()", async () => {
    const invalidBlocks = await bank.getInvalidBlocks();
    expect(invalidBlocks).toBeTruthy();
  });

  it("getValidatorConfirmationServices()", async () => {
    const validatorConfirmationServices = await bank.getValidatorConfirmationServices();
    expect(validatorConfirmationServices).toBeTruthy();
  });

  it("getValidators()", async () => {
    const validators = await bank.getValidators();
    expect(validators).toBeTruthy();
  });

  it("getBankPV()", async () => {
    const pv = await bank.getBankPV();
    expect(pv).toBeTruthy();
  });

  it("getTxFee()", async () => {
    const txFee = await bank.getTxFee();
    expect(typeof txFee).toBe("number");
  });
});
