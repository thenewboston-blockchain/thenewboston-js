const tnb = require("../");
const nock = require("nock");
const data = require("./data/primaryValidator");

describe("PrimaryValidator", () => {
  beforeAll(() => {
    nock("http://54.241.124.162").get("/config").reply(200, data.config);
    nock("http://54.241.124.162").get("/config").reply(200, data.config);
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
});
