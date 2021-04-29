const tnb = require("../dist");
const nock = require("nock");
const data = require("./data/primaryValidator");

describe("PrimaryValidator", () => {
  beforeAll(() => {
    nock("http://54.241.124.162").get("/config").reply(200, data.config);
    nock("http://54.241.124.162").get("/config").reply(200, data.config);
    nock("http://54.241.124.162").post("/bank_blocks").reply(200, data.bank_blocks);
  });
  afterAll(() => nock.cleanAll());

  const primaryValidator = new tnb.PrimaryValidator("http://54.241.124.162");

  it("constructor()", async () => {
    const pv = new tnb.PrimaryValidator("http://54.241.124.162", { defaultPagination: { limit: 2, offset: 10 } });
    expect(pv.url).toBe("http://54.241.124.162");
    expect(pv.options).toStrictEqual({ defaultPagination: { limit: 2, offset: 10 } });
  });

  it("getConfig()", async () => {
    const config = await primaryValidator.getConfig();
    expect(typeof config).toBe("object");
    expect(config).toStrictEqual({
      primary_validator: null,
      account_number: "c7498d45482098a4c4e2b2fa405fdb00e5bc74bf4739c43417e7c50ff08c4109",
      ip_address: "54.241.124.162",
      node_identifier: "354804f86a2f5fa5c2f7bfc5da6bae78ec18beea2c991c6eca00877bf0ea9f01",
      port: 80,
      protocol: "http",
      version: "v1.0",
      default_transaction_fee: 1,
      root_account_file: "http://54.241.124.162:80/media/root_account_file.json",
      root_account_file_hash: "ab9b95e5bb1dc66dd57ebf2cb8a8dece41748389d68077f74c916659f4bd2f1b",
      seed_block_identifier: "",
      daily_confirmation_rate: 1,
      node_type: "PRIMARY_VALIDATOR",
    });
  });

  it("getTxFee()", async () => {
    const txFee = await primaryValidator.getTxFee();
    expect(typeof txFee).toBe("number");
  });

  it("addBankBlocks(balanceLock, transactions, account)", async () => {
    const res = await primaryValidator.addBankBlocks(
      "fakeBalanceLock",
      [{ amount: 1, recipient: "fakeAccountNumber" }],
      new tnb.Account("56ed13931da39aa9ce3eab53c5b66edb2fc90660d322c89312bd62f1d69da289")
    );
    expect(typeof res).toBe("object");
    expect(res).toStrictEqual({
      account_number: "755ba2840909ae88987ef9de08dc5882ffa1e3df774e95a9500f5a9cfb4fe0be",
      message: {
        balance_key: "755ba2840909ae88987ef9de08dc5882ffa1e3df774e95a9500f5a9cfb4fe0be",
        txs: [
          {
            amount: 1,
            recipient: "5e76c46de6256db3987de8d78ef4af8d792979a95fdd1094bcad3e00c82d0e08",
          },
          {
            amount: 1,
            recipient: "6e3232cb30bdcb79494ca9c1993dfbe6845a2f079438a7d56502f94fbd64bb2b",
          },
          {
            amount: 1,
            recipient: "7bb9787dec7ee1978b43c182e554e5e5e62627e80f3fa6681e7f983930dbb1be",
          },
        ],
      },
      signature:
        "78e6288a1a3a38af78f824c8cbe9f6152eafe692828df93c759e41f0088839388a45cf22739fb62de7aa3a9caee51222293bbe8a6f5ac64ded03356301870a0a",
    });
  });
});
