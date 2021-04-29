const nock = require("nock");

const cvData = require("./data/confirmationValidator");
const { Account, ConfirmationValidator } = require("../dist");

describe("", () => {
  const cv = new ConfirmationValidator("http://3.101.33.24", { defaultPagination: { limit: 20, offset: 0 } });
  const cvNID = "f4e756be5067cc974b13f08ef3e47aef298cb767807d97e320c46f2a815d6729";

  const accountNumber = "330cf5f7a06b7915adbc1a26228bf1fa6729aff9133259916c393383cf9f6d7d";
  const bankNID = "a0fa98ce5c4974b6fc2333e284133da5095adc49c143c3f2cdadfa502b13a8bd";
  const validatorNID = "9375feb25085c6f2a58640404e7c16582e210a6a12717c8d3d5307f750c861fc";
  const confirmationBlockID = "f0b89767914480ebd12301e11580b08ca2a53cf3f14adf3d2afd7b3e5e7e6d74";

  beforeAll(() => {
    nock("http://3.101.33.24")
      .get(`/accounts/${accountNumber}/balance`)
      .reply(200, cvData.accountBalance)
      .get(`/accounts/${accountNumber}/balance_lock`)
      .reply(200, cvData.accountBalanceLock)
      .get("/accounts")
      .query({ limit: 20, offset: 0 })
      .reply(200, cvData.accounts)
      .get(`/banks/${bankNID}`)
      .reply(200, cvData.bank)
      .get("/banks")
      .query({ limit: 20, offset: 0 })
      .reply(200, cvData.banks)
      .get("/clean")
      .reply(200, cvData.clean.get)
      .post("/clean")
      .reply(200, cvData.clean.start)
      .post("/clean")
      .reply(200, cvData.clean.stop)
      .get("/config")
      .reply(200, cvData.config)
      .get("/bank_confirmation_services")
      .query({ limit: 20, offset: 0 })
      .reply(200, cvData.confirmationServices)
      .get(`/confirmation_blocks/${confirmationBlockID}/valid`)
      .reply(200, cvData.confirmationBlock.valid)
      .get("/crawl")
      .reply(200, cvData.crawl.get)
      .post("/crawl")
      .reply(200, cvData.crawl.start)
      .post("/crawl")
      .reply(200, cvData.crawl.stop)
      .get(`/validators/${validatorNID}`)
      .reply(200, cvData.validator)
      .get("/validators")
      .query({ limit: 20, offset: 0 })
      .reply(200, cvData.validators);
  });

  afterAll(() => nock.cleanAll());

  it("getAccountBalance(accountNumber: string)", async () => {
    const balance = await cv.getAccountBalance(accountNumber);

    expect(balance).toStrictEqual({ balance: 5004 });
  });

  it("getAccountBalanceLock(accountNumber: string)", async () => {
    const balanceLock = await cv.getAccountBalanceLock(accountNumber);

    expect(balanceLock).toStrictEqual({
      balance_lock: "330cf5f7a06b7915adbc1a26228bf1fa6729aff9133259916c393383cf9f6d7d",
    });
  });

  it("getAccounts(options: Partial<PaginationOptions> = {})", async () => {
    const accounts = await cv.getAccounts();

    expect(accounts).toStrictEqual(cvData.accounts);
    expect(accounts.results.length).toBeLessThanOrEqual(20);
  });

  it("getBank(nodeIdentifier: string)", async () => {
    const specifiedBank = await cv.getBank(bankNID);

    expect(specifiedBank.node_identifier).toBe(bankNID);
    expect(specifiedBank).toStrictEqual({
      account_number: "e3a94381f8db207ddad931391886d611d6f4c060d0db2b0e373738e2f4db96d6",
      ip_address: "54.177.121.3",
      node_identifier: "a0fa98ce5c4974b6fc2333e284133da5095adc49c143c3f2cdadfa502b13a8bd",
      port: 80,
      protocol: "http",
      version: "v1.0",
      default_transaction_fee: 1,
      confirmation_expiration: "2021-07-23T22:33:32.451310Z",
      trust: "0.00",
    });
  });

  it("getBanks(options: Partial<PaginationOptions> = {})", async () => {
    const connectedBanks = await cv.getBanks();

    expect(connectedBanks.results.length).toBeLessThanOrEqual(20);
    expect(connectedBanks).toStrictEqual({
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          account_number: "e3a94381f8db207ddad931391886d611d6f4c060d0db2b0e373738e2f4db96d6",
          ip_address: "54.177.121.3",
          node_identifier: "a0fa98ce5c4974b6fc2333e284133da5095adc49c143c3f2cdadfa502b13a8bd",
          port: 80,
          protocol: "http",
          version: "v1.0",
          default_transaction_fee: 1,
          confirmation_expiration: null,
          trust: "0.00",
        },
        {
          account_number: "a7ef465b163bcafae5b2a29d879aa1c314761b3bcfe8fb255cf960ddf226b2c3",
          ip_address: "13.244.248.94",
          node_identifier: "ed0c31cc8b3e1cb5200bf2d9bad96434b4c65529503e2e2427efb3a453eebd5d",
          port: 80,
          protocol: "http",
          version: "v1.0",
          default_transaction_fee: 1,
          confirmation_expiration: null,
          trust: "0.00",
        },
      ],
    });
  });

  it("getCleanStatus()", async () => {
    const clean = await cv.getCleanStatus();

    expect(clean.clean_last_completed).toBe("2021-03-21 11:15:07.923380+00:00");
    expect(["cleaning", "not_cleaning", null].includes(clean.clean_status)).toBeTruthy;
    expect(clean.ip_address).toBe("3.101.33.24");
    expect(clean.port).toBe(80);
    expect(clean.protocol).toBe("http");
  });

  it("startClean()", async () => {
    const account = new Account(validatorNID);
    const clean = await cv.startClean(account);

    expect(clean.clean_last_completed).toBe("2021-03-21 11:15:07.923380+00:00");
    expect(clean.clean_status).toBe("cleaning");
    expect(clean.ip_address).toBe("3.101.33.24");
    expect(clean.port).toBe(80);
    expect(clean.protocol).toBe("http");
  });

  it("stopClean()", async () => {
    const account = new Account(validatorNID);
    const clean = await cv.stopClean(account);

    expect(clean.clean_last_completed).toBe("2021-03-21 11:15:07.923380+00:00");
    expect(["stop_requested", "not_cleaning", null].includes(clean.clean_status)).toBeTruthy;
    expect(clean.ip_address).toBe("3.101.33.24");
    expect(clean.port).toBe(80);
    expect(clean.protocol).toBe("http");
  });

  it("getConfig()", async () => {
    const config = await cv.getConfig();

    expect(config.ip_address).toBe("3.101.33.24");
    expect(config.node_identifier).toBe(cvNID);
    expect(config).toStrictEqual({
      primary_validator: {
        account_number: "4afb3eaad999e4c073be0fbde86b76f9370d53b398b9cab9d760825709a1d6b3",
        ip_address: "54.219.183.128",
        node_identifier: "9375feb25085c6f2a58640404e7c16582e210a6a12717c8d3d5307f750c861fc",
        port: 80,
        protocol: "http",
        version: "v1.0",
        default_transaction_fee: 1,
        root_account_file: "http://54.219.183.128:80/media/root_account_file.json",
        root_account_file_hash: "be00d11e661cbb9158e81a9a34a67738bd662ccced1ab5fc93ee775bc1841683",
        seed_block_identifier: "",
        daily_confirmation_rate: 1,
        trust: "100.00",
      },
      account_number: "d32e26852fa5882c3997e7d48e07accf4c185699d2e832898a63c93862a01a4a",
      ip_address: "3.101.33.24",
      node_identifier: "f4e756be5067cc974b13f08ef3e47aef298cb767807d97e320c46f2a815d6729",
      port: 80,
      protocol: "http",
      version: "v1.0",
      default_transaction_fee: 1,
      root_account_file: "http://3.101.33.24:80/media/root_account_file.json",
      root_account_file_hash: "be00d11e661cbb9158e81a9a34a67738bd662ccced1ab5fc93ee775bc1841683",
      seed_block_identifier: "",
      daily_confirmation_rate: 1,
      node_type: "CONFIRMATION_VALIDATOR",
    });
  });

  it("getBankConfirmationServices()", async () => {
    const confirmationServices = await cv.getBankConfirmationServices();

    expect(confirmationServices.results.length).toBeLessThanOrEqual(20);
    expect(confirmationServices).toStrictEqual(cvData.confirmationServices);
  });

  it("getValidConfirmationBlock()", async () => {
    const block = await cv.getValidConfirmationBlock(confirmationBlockID);

    expect(block.node_identifier).toBe(cvNID);
    expect(block.message.block_identifier).toBe(confirmationBlockID);
    expect(block).toStrictEqual(cvData.confirmationBlock.valid);
  });

  it("getCrawlStatus()", async () => {
    const crawl = await cv.getCrawlStatus();

    expect(crawl.crawl_last_completed).toBe("2021-03-21 11:15:07.923380+00:00");
    expect(["crawling", "not_crawling", null].includes(crawl.crawl_status)).toBeTruthy;
    expect(crawl.ip_address).toBe("3.101.33.24");
    expect(crawl.port).toBe(80);
    expect(crawl.protocol).toBe("http");
  });

  it("startCrawl()", async () => {
    const account = new Account(validatorNID);
    const crawl = await cv.startCrawl(account);

    expect(crawl.crawl_last_completed).toBe("2021-03-21 11:15:07.923380+00:00");
    expect(crawl.crawl_status).toBe("crawling");
    expect(crawl.ip_address).toBe("3.101.33.24");
    expect(crawl.port).toBe(80);
    expect(crawl.protocol).toBe("http");
  });

  it("stopCrawl()", async () => {
    const account = new Account(validatorNID);
    const crawl = await cv.stopCrawl(account);

    expect(crawl.crawl_last_completed).toBe("2021-03-21 11:15:07.923380+00:00");
    expect(["stop_requested", "not_crawling", null].includes(crawl.crawl_status)).toBeTruthy;
    expect(crawl.ip_address).toBe("3.101.33.24");
    expect(crawl.port).toBe(80);
    expect(crawl.protocol).toBe("http");
  });

  it("getValidator()", async () => {
    const validatorConfig = await cv.getValidator(validatorNID);

    expect(validatorConfig.node_identifier).toBe(validatorNID);
    expect(validatorConfig).toStrictEqual({
      account_number: "4afb3eaad999e4c073be0fbde86b76f9370d53b398b9cab9d760825709a1d6b3",
      ip_address: "54.219.183.128",
      node_identifier: "9375feb25085c6f2a58640404e7c16582e210a6a12717c8d3d5307f750c861fc",
      port: 80,
      protocol: "http",
      version: "v1.0",
      default_transaction_fee: 1,
      root_account_file: "http://54.219.183.128:80/media/root_account_file.json",
      root_account_file_hash: "be00d11e661cbb9158e81a9a34a67738bd662ccced1ab5fc93ee775bc1841683",
      seed_block_identifier: "",
      daily_confirmation_rate: 1,
      trust: "100.00",
    });
  });

  it("getValidators()", async () => {
    const validators = await cv.getValidators({ limit: 20, offset: 0 });

    expect(validators).toStrictEqual({
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          account_number: "4afb3eaad999e4c073be0fbde86b76f9370d53b398b9cab9d760825709a1d6b3",
          ip_address: "54.219.183.128",
          node_identifier: "9375feb25085c6f2a58640404e7c16582e210a6a12717c8d3d5307f750c861fc",
          port: 80,
          protocol: "http",
          version: "v1.0",
          default_transaction_fee: 1,
          root_account_file: "http://54.219.183.128:80/media/root_account_file.json",
          root_account_file_hash: "be00d11e661cbb9158e81a9a34a67738bd662ccced1ab5fc93ee775bc1841683",
          seed_block_identifier: "",
          daily_confirmation_rate: 1,
          trust: "100.00",
        },
        {
          account_number: "d32e26852fa5882c3997e7d48e07accf4c185699d2e832898a63c93862a01a4a",
          ip_address: "3.101.33.24",
          node_identifier: "f4e756be5067cc974b13f08ef3e47aef298cb767807d97e320c46f2a815d6729",
          port: 80,
          protocol: "http",
          version: "v1.0",
          default_transaction_fee: 1,
          root_account_file: "http://3.101.33.24:80/media/root_account_file.json",
          root_account_file_hash: "be00d11e661cbb9158e81a9a34a67738bd662ccced1ab5fc93ee775bc1841683",
          seed_block_identifier: "",
          daily_confirmation_rate: 1,
          trust: "100.00",
        },
      ],
    });
  });
});
