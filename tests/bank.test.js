const tnb = require("../dist");
const nock = require("nock");
const data = require("./data/bank");

describe("Bank", () => {
  beforeAll(() => {
    nock("http://13.57.215.62")
      .get("/bank_transactions")
      .query({ limit: 20, offset: 0 })
      .reply(200, data.bank_transactions)

      .patch("/accounts/fakeAccountNumber")
      .reply(200, data.accounts.patch)

      .get("/banks")
      .query({ limit: 20, offset: 0 })
      .reply(200, data.banks.get)

      .patch("/banks/fakeNodeIdentifier")
      .reply(200, data.banks.patch)

      .get("/blocks")
      .query({ limit: 20, offset: 0 })
      .reply(200, data.blocks.get)

      .post("/blocks")
      .reply(200, data.blocks.post)

      .get("/config")
      .reply(200, data.config)

      .get("/confirmation_blocks")
      .query({ limit: 20, offset: 0 })
      .reply(200, data.confirmation_blocks.get)

      .get("/crawl")
      .reply(200, data.crawl.get)

      .post("/crawl")
      .reply(200, data.crawl.post)

      .post("/crawl")
      .reply(200, data.crawl.post)

      .get("/invalid_blocks")
      .query({ limit: 20, offset: 0 })
      .reply(200, data.invalid_blocks)

      .get("/validator_confirmation_services")
      .query({ limit: 20, offset: 0 })
      .reply(200, data.validator_confirmation_services.get)

      .post("/validator_confirmation_services")
      .reply(200, data.validator_confirmation_services.post)

      .get("/validators")
      .query({ limit: 20, offset: 0 })
      .reply(200, data.validators)

      .get("/config")
      .reply(200, data.config)

      .get("/config")
      .reply(200, data.config)

      .get("/clean")
      .reply(200, data.clean.get)

      .post("/clean")
      .reply(200, data.clean.post)

      .post("/clean")
      .reply(200, data.clean.post);
  });
  afterAll(() => nock.cleanAll());

  it("constructor()", async () => {
    const bank = new tnb.Bank("http://13.57.215.62", { defaultPagination: { limit: 2, offset: 10 } });
    expect(bank.url).toBe("http://13.57.215.62");
    expect(bank.options).toStrictEqual({ defaultPagination: { limit: 2, offset: 10 } });
  });

  const bank = new tnb.Bank("http://13.57.215.62");

  it("updateAccountTrust(accountNumber, trust, account)", async () => {
    const res = await bank.updateAccountTrust("fakeAccountNumber", 10, new tnb.Account());
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
      id: "443aabd9-d06b-4c4b-af3b-5a21cbee523d",
      block: {
        id: "04f407d2-35fa-4416-99f4-1ea39612a014",
        created_date: "2021-04-12T08:21:32.612926Z",
        modified_date: "2021-04-12T08:21:32.612953Z",
        balance_key: "d2af51bfc15be5af4c4120c488625b7b224f6acb84a4467a4dd8f1647a0ec8e8",
        sender: "22d0f0047b572a6acb6615f7aae646b0b96ddc58bfd54ed2775f885baeba3d6a",
        signature:
          "9e715ea8e5c173a87369215868c649fbe164444ea138d2fff4e4add80f4ccdb3a5ee6a529964b43a5b9fd611d504b58c52c380792ed359c036763942e003a002",
      },
      amount: 1,
      fee: "PRIMARY_VALIDATOR",
      memo: "",
      recipient: "4afb3eaad999e4c073be0fbde86b76f9370d53b398b9cab9d760825709a1d6b3",
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

  it("addBlocks(balanceLock, transactions, account)", async () => {
    const res = await bank.addBlocks(
      "fakeBalanceLock",
      [{ amount: 1, recipient: "fakeAccountNumber" }],
      new tnb.Account(),
      "Memo"
    );
    expect(typeof res).toBe("object");
    expect(res).toStrictEqual({
      id: "3ff4ebb0-2b3d-429b-ba90-08133fcdee4e",
      created_date: "2020-07-09T21:45:25.909512Z",
      modified_date: "2020-07-09T21:45:25.909557Z",
      balance_key: "ce51f0d9facaa7d3e69657429dd3f961ce70077a8efb53dcda508c7c0a19d2e3",
      sender: "0cdd4ba04456ca169baca3d66eace869520c62fe84421329086e03d91a68acdb",
      signature:
        "ee5a2f2a2f5261c1b633e08dd61182fd0db5604c853ebd8498f6f28ce8e2ccbbc38093918610ea88a7ad47c7f3192ed955d9d1529e7e390013e43f25a5915c0f",
    });
  });

  it("getConfig()", async () => {
    const config = await bank.getConfig();
    expect(typeof config).toBe("object");
    expect(config).toStrictEqual({
      primary_validator: {
        account_number: "2e86f48216567302527b69eae6c6a188097ed3a9741f43cc3723e570cf47644c",
        ip_address: "54.183.17.224",
        node_identifier: "2262026a562b0274163158e92e8fbc4d28e519bc5ba8c1cf403703292be84a51",
        port: null,
        protocol: "http",
        version: "v1.0",
        default_transaction_fee: 1,
        root_account_file:
          "https://gist.githubusercontent.com/buckyroberts/0688f136b6c1332be472a8baf10f78c5/raw/323fcd29672e392be2b934b82ab9eac8d15e840f/alpha-00.json",
        root_account_file_hash: "0f775023bee79884fbd9a90a76c5eacfee38a8ca52735f7ab59dab63a75cbee1",
        seed_block_identifier: "",
        daily_confirmation_rate: null,
        trust: "100.00",
      },
      account_number: "dfddf07ec15cbf363ecb52eedd7133b70b3ec896b488460bcecaba63e8e36be5",
      ip_address: "143.110.137.54",
      node_identifier: "6dbaff44058e630cb375955c82b0d3bd7bc7e20cad93e74909a8951f747fb8a4",
      port: null,
      protocol: "http",
      version: "v1.0",
      default_transaction_fee: 1,
      node_type: "BANK",
    });
  });

  it("getConfirmationBlocks()", async () => {
    const confirmationBlocks = await bank.getConfirmationBlocks();
    expect(typeof confirmationBlocks).toBe("object");
    expect(confirmationBlocks).toStrictEqual({
      count: 1654,
      next: "http://143.110.137.54/confirmation_blocks?limit=50&offset=50",
      previous: null,
      results: [
        {
          id: "e7c5c2e0-8ed1-4eb3-abd8-97fa2e5ca8db",
          created_date: "2020-10-08T02:18:07.908635Z",
          modified_date: "2020-10-08T02:18:07.908702Z",
          block_identifier: "824614aa97edb391784b17ce6956b70aed31edf741c1858d43ae4d566b2a13ed",
          block: "c6fc11cf-8948-4d32-96c9-d56caa6d5b24",
          validator: "e2a138b0-ebe9-47d2-a146-fb4d9d9ca378",
        },
        {
          id: "78babf4b-74ed-442e-b5ab-7b23345c18f8",
          created_date: "2020-10-08T02:18:07.998146Z",
          modified_date: "2020-10-08T02:18:07.998206Z",
          block_identifier: "824614aa97edb391784b17ce6956b70aed31edf741c1858d43ae4d566b2a13ed",
          block: "c6fc11cf-8948-4d32-96c9-d56caa6d5b24",
          validator: "97a878ac-328a-47b6-ac93-be6deee75d94",
        },
        {
          id: "7894e41e-140d-4651-879c-25a3bad2640a",
          created_date: "2020-10-11T23:23:52.112441Z",
          modified_date: "2020-10-11T23:23:52.112505Z",
          block_identifier: "2d0436023e6037439f11c7273a8a2a8af7ea9b10bcb4cfd5b839cfbeafa1c282",
          block: "a3c262de-69dd-4a84-a389-70492ccfed0a",
          validator: "97a878ac-328a-47b6-ac93-be6deee75d94",
        },
      ],
    });
  });

  it("getCrawlStatus()", async () => {
    const crawl = await bank.getCrawlStatus();
    expect(typeof crawl).toBe("object");
    expect(crawl).toStrictEqual({
      crawl_last_completed: "2021-03-08 21:25:31.264412+00:00",
      crawl_status: "not_crawling",
      ip_address: "13.57.215.62",
      port: 80,
      protocol: "http",
    });
  });

  it("startCrawl(account)", async () => {
    const res = await bank.startCrawl(new tnb.Account());
    expect(typeof res).toBe("object");
    expect(res).toStrictEqual({
      crawl_last_completed: "2020-11-21 11:15:07.923380+00:00",
      crawl_status: "crawling",
      ip_address: "20.188.56.203",
      protocol: "http",
    });
  });

  it("stopCrawl(account)", async () => {
    const res = await bank.stopCrawl(new tnb.Account());
    expect(typeof res).toBe("object");
    expect(res).toStrictEqual({
      crawl_last_completed: "2020-11-21 11:15:07.923380+00:00",
      crawl_status: "crawling",
      ip_address: "20.188.56.203",
      protocol: "http",
    });
  });

  it("getInvalidBlocks()", async () => {
    const invalidBlocks = await bank.getInvalidBlocks();
    expect(typeof invalidBlocks).toBe("object");
    expect(invalidBlocks).toStrictEqual({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
  });

  it("getValidatorConfirmationServices()", async () => {
    const validatorConfirmationServices = await bank.getValidatorConfirmationServices();
    expect(typeof validatorConfirmationServices).toBe("object");
    expect(validatorConfirmationServices).toStrictEqual({
      count: 5,
      next: null,
      previous: null,
      results: [
        {
          id: "be1a1100-f0ac-4262-868f-ef9708a469f7",
          created_date: "2021-03-03T04:20:56.854780Z",
          modified_date: "2021-03-03T04:20:56.854803Z",
          end: "2021-03-04T04:20:56.803236Z",
          start: "2021-03-03T04:20:56.803236Z",
          validator: "aecc8de8-8d6f-4fd6-b674-8137a1090c22",
        },
        {
          id: "c9579846-17b0-4304-a815-24fb131346fd",
          created_date: "2021-03-03T04:28:26.466321Z",
          modified_date: "2021-03-03T04:28:26.466344Z",
          end: "2021-03-06T04:20:56.803236Z",
          start: "2021-03-04T04:20:56.803236Z",
          validator: "aecc8de8-8d6f-4fd6-b674-8137a1090c22",
        },
        {
          id: "e38113ee-8443-49d0-959b-0706e6c1208e",
          created_date: "2021-03-03T04:29:46.261348Z",
          modified_date: "2021-03-03T04:29:46.261371Z",
          end: "2021-03-08T04:20:56.803236Z",
          start: "2021-03-06T04:20:56.803236Z",
          validator: "aecc8de8-8d6f-4fd6-b674-8137a1090c22",
        },
        {
          id: "390ad8ad-bc70-4cb0-87d3-c239a26f2884",
          created_date: "2021-03-04T16:45:02.987075Z",
          modified_date: "2021-03-04T16:45:02.987097Z",
          end: "2021-04-06T04:20:56.803236Z",
          start: "2021-03-08T04:20:56.803236Z",
          validator: "aecc8de8-8d6f-4fd6-b674-8137a1090c22",
        },
        {
          id: "88e095ae-e00c-4d02-85fa-f25f812592f0",
          created_date: "2021-03-08T21:25:16.247090Z",
          modified_date: "2021-03-08T21:25:16.247109Z",
          end: "2021-06-05T04:20:56.803236Z",
          start: "2021-04-06T04:20:56.803236Z",
          validator: "aecc8de8-8d6f-4fd6-b674-8137a1090c22",
        },
      ],
    });
  });

  it("updateValidatorConfirmationServices(start, end, account)", async () => {
    const res = await bank.updateValidatorConfirmationServices(1, 10, new tnb.Account());
    expect(typeof res).toBe("object");
    expect(res).toStrictEqual({
      id: "a6e4f1b5-21ea-464d-ba24-027e48b1c1aa",
      created_date: "2020-12-17T16:01:05.627955Z",
      modified_date: "2020-12-17T16:01:05.627982Z",
      end: "2020-12-19T16:01:05.474612Z",
      start: "2020-12-17T16:01:05.474601Z",
      validator: "d79345f0-ea3a-4bcd-9a42-d4cb23133ecc",
    });
  });

  it("getValidators()", async () => {
    const validators = await bank.getValidators();
    expect(typeof validators).toBe("object");
    expect(validators).toStrictEqual({
      count: 10,
      next: "http://54.219.178.46/validators?limit=2&offset=2",
      previous: null,
      results: [
        {
          account_number: "4699a423c455a40feb1d6b90b167584a880659e1bf9adf9954a727d534ff0c16",
          ip_address: "54.219.178.46",
          node_identifier: "b1b232503b3db3975524faf98674f22c83f4357c3d946431b8a8568715d7e1d9",
          port: null,
          protocol: "http",
          version: "v1.0",
          default_transaction_fee: 1,
          root_account_file: "http://54.219.178.46/media/root_account_file.json",
          root_account_file_hash: "cc9390cc579dc8a99a1f34c1bea5d54a0f45b27ecee7e38662f0cd853f76744d",
          seed_block_identifier: "",
          daily_confirmation_rate: 1,
          trust: "100.00",
        },
        {
          account_number: "2e86f48216567302527b69eae6c6a188097ed3a9741f43cc3723e570cf47644c",
          ip_address: "54.183.17.224",
          node_identifier: "2262026a562b0274163158e92e8fbc4d28e519bc5ba8c1cf403703292be84a51",
          port: null,
          protocol: "http",
          version: "v1.0",
          default_transaction_fee: 1,
          root_account_file: "http://54.183.17.224/media/root_account_file.json",
          root_account_file_hash: "cc9390cc579dc8a99a1f34c1bea5d54a0f45b27ecee7e38662f0cd853f76744d",
          seed_block_identifier: "",
          daily_confirmation_rate: null,
          trust: "100.00",
        },
      ],
    });
  });

  it("getBankPV()", async () => {
    const pv = await bank.getBankPV();
    expect(pv).toBeInstanceOf(tnb.PrimaryValidator);
    expect(pv.url).toBe("http://54.183.17.224");
  });

  it("getTxFee()", async () => {
    const txFee = await bank.getTxFee();
    expect(typeof txFee).toBe("number");
    expect(txFee).toBe(1);
  });

  it("getCleanStatus()", async () => {
    const cleanStatus = await bank.getCleanStatus();
    expect(typeof cleanStatus).toBe("object");
    expect(cleanStatus).toStrictEqual({
      clean_last_completed: "2020-11-21 11:15:07.923380+00:00",
      clean_status: "cleaning",
      ip_address: "20.188.56.203",
      protocol: "http",
    });
  });

  it("startClean(account)", async () => {
    const res = await bank.startClean(new tnb.Account());
    expect(typeof res).toBe("object");
    expect(res).toStrictEqual({
      clean_last_completed: "2020-11-21 11:15:07.923380+00:00",
      clean_status: "cleaning",
      ip_address: "20.188.56.203",
      protocol: "http",
    });
  });

  it("stopClean(account)", async () => {
    const res = await bank.stopClean(new tnb.Account());
    expect(typeof res).toBe("object");
    expect(res).toStrictEqual({
      clean_last_completed: "2020-11-21 11:15:07.923380+00:00",
      clean_status: "cleaning",
      ip_address: "20.188.56.203",
      protocol: "http",
    });
  });
});
