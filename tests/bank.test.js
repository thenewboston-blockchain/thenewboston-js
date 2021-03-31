const tnb = require("../");
const nock = require("nock");
const data = require("./data/bank");

describe("Bank", () => {
  beforeAll(() => {
    nock("http://13.57.215.62")
      .get("/bank_transactions")
      .query({ limit: 20, offset: 0 })
      .reply(200, data.bank_transactions);
    nock("http://13.57.215.62").patch("/accounts/fakeAccountNumber").reply(200, data.accounts.patch);
    nock("http://13.57.215.62").get("/banks").query({ limit: 20, offset: 0 }).reply(200, data.banks.get);
    nock("http://13.57.215.62").patch("/banks/fakeNodeIdentifier").reply(200, data.banks.patch);
    nock("http://13.57.215.62").get("/blocks").query({ limit: 20, offset: 0 }).reply(200, data.blocks.get);
  });
  afterAll(() => nock.cleanAll());

  it("constructor()", async () => {
    const bank = new tnb.Bank("http://13.57.215.62", { defaultPagination: { limit: 2, offset: 10 } });
    expect(bank.url).toBe("http://13.57.215.62");
    expect(bank.options).toStrictEqual({ defaultPagination: { limit: 2, offset: 10 } });
  });

  const bank = new tnb.Bank("http://13.57.215.62");

  it("updateAccount(accountNumber, trust, account)", async () => {
    const res = await bank.updateAccount("fakeAccountNumber", 10, new tnb.Account());
    expect(typeof res).toBe("object");
    expect(res).toStrictEqual({
      id: "64426fc5-b3ac-42fb-b75b-d5ccfcdc6872",
      created_date: "2020-07-14T02:59:22.204580Z",
      modified_date: "2020-07-21T00:58:01.013685Z",
      account_number: "0cdd4ba04456ca169baca3d66eace869520c62fe84421329086e03d91a68acdb",
      trust: "99.98",
    });
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
    expect(typeof banks).toBe("object");
    expect(banks).toStrictEqual({
      count: 17,
      next: "http://143.110.137.54/banks?limit=2&offset=6",
      previous: "http://143.110.137.54/banks?limit=2&offset=2",
      results: [
        {
          account_number: "da8500cb8e2ffd728f919cfae82b1c4e97ca2558f2545ab1b020a4172642dce3",
          ip_address: "34.202.233.224",
          node_identifier: "3d6de056dc9ecbca2b4c832017dcb5dbdc2c95dd3175244acf7dfbc21add76de",
          port: 80,
          protocol: "http",
          version: "v1.0",
          default_transaction_fee: 1,
          trust: "0.00",
        },
        {
          account_number: "c4caa42b2a01b31ee187468ac63bd64745f67ec3b20191a54eb55ba20d5adbb0",
          ip_address: "18.191.29.186",
          node_identifier: "8990b681d8d14b3bf2cd38782c6053bb365cc54616f06ec8d88d9dadb8aa0780",
          port: 80,
          protocol: "http",
          version: "v1.0",
          default_transaction_fee: 1,
          trust: "0.00",
        },
      ],
    });
  });

  it("updateBankTrust(nodeIdentifier, trust, account)", async () => {
    const res = await bank.updateBankTrust("fakeNodeIdentifier", 10, new tnb.Account());
    expect(typeof res).toBe("object");
    expect(res).toStrictEqual({
      account_number: "dfddf07ec15cbf363ecb52eedd7133b70b3ec896b488460bcecaba63e8e36be5",
      ip_address: "143.110.137.54",
      node_identifier: "6dbaff44058e630cb375955c82b0d3bd7bc7e20cad93e74909a8951f747fb8a4",
      port: null,
      protocol: "http",
      version: "v1.0",
      default_transaction_fee: 1,
      trust: "76.43",
    });
  });

  it("getBlocks()", async () => {
    const blocks = await bank.getBlocks();
    expect(typeof blocks).toBe("object");
    expect(blocks).toStrictEqual({
      count: 805,
      next: "http://143.110.137.54/blocks?limit=2&offset=2",
      previous: null,
      results: [
        {
          id: "c6fc11cf-8948-4d32-96c9-d56caa6d5b24",
          created_date: "2020-10-08T02:18:07.324999Z",
          modified_date: "2020-10-08T02:18:07.325044Z",
          balance_key: "a37e2836805975f334108b55523634c995bd2a4db610062f404510617e83126f",
          sender: "a37e2836805975f334108b55523634c995bd2a4db610062f404510617e83126f",
          signature:
            "a2ba346d98cb1f7ce6bf017240d674a9928796ddb564a2c8817e68ead0ea02d960e970fe581c6d3a25b9876e1873d51c882b23d843e32f511d9575ef60d2940d",
        },
        {
          id: "797b7324-905f-42e1-95a3-df918d01e3b0",
          created_date: "2020-10-08T02:18:48.575966Z",
          modified_date: "2020-10-08T02:18:48.576030Z",
          balance_key: "92b9360e31f5ae4fa074ee5e03322aff6c275872e2afc31fbd523f022f18e421",
          sender: "a37e2836805975f334108b55523634c995bd2a4db610062f404510617e83126f",
          signature:
            "54875b5fa4db317133b7195d5afa43e5d7c7659970b5c07f7408fb43524573ee0db3078daffa3a5fc341c6851a85c5128d8a79b8f71d5f7d87e275ccca1e8408",
        },
      ],
    });
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
