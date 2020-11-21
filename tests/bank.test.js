const { Bank } = require("../");
const { createMockResponse } = require("./utils");
jest.mock("axios");

describe("Bank", () => {
  const url = "http://143.110.137.54";
  const defaultBank = new Bank(url);
  it("getAccounts()", async () => {
    const result = [
      {
        id: "4cb1cdbe-ebbf-43c8-9f86-826aaa2af250",
        account_number: "9bfa37627e2dba0ae48165b219e76ceaba036b3db8e84108af73a1cce01fad35",
        balance: 6,
        balance_lock: "749f6faa4eeeda50f51334e903a1eaae084435d53d2a85fb0993a518fef27273",
      },
    ];
    createMockResponse(result);
    expect(await defaultBank.getAccounts()).toEqual(result);
  });

  it("getTransactions()", async () => {
    const result = {
      count: 1,
      next: "http://143.110.137.54/bank_transactions?limit=1&offset=1",
      previous: null,
      results: [
        {
          id: "b77f8950-62b9-4cea-9fc9-823654537c85",
          block: {
            id: "83da16f3-e7f9-4003-b451-0692bc4f3c27",
            created_date: "2020-11-14T21:00:56.404639Z",
            modified_date: "2020-11-14T21:00:56.404688Z",
            balance_key: "97bc9c53e571415b8cbeee9671810aae7866f4b34d47a8a7f8c3b1c830e70400",
            sender: "a24224f383973a00065e16e270061966208dd64f053441c96a3f76f68549c0d8",
            signature:
              "8f7f1d8d9fee6dedb39a6ca4d95dd94d05cbc32ab16f3402ad7a6a9c7ac9417e38d53eacccd46fc9fff019a12530f0a06a2175ccd96e01dbfec4a8a4d1138f07",
          },
          amount: 1,
          recipient: "2e86f48216567302527b69eae6c6a188097ed3a9741f43cc3723e570cf47644c",
        },
      ],
    };
    createMockResponse(result);
    expect(await defaultBank.getAccounts()).toEqual(result);
  });

  it("getBlocks()", async () => {
    const result = {
      count: 3,
      next: "http://143.110.137.54/blocks?limit=3&offset=3",
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
        {
          id: "402d5976-cbaa-4d89-b5d7-bddfe0aa5a3d",
          created_date: "2020-10-08T02:19:03.054113Z",
          modified_date: "2020-10-08T02:19:03.054179Z",
          balance_key: "e1a7326f64a2569dc3aaace8c325845182059d9e800a4ec2900200a66a23edeb",
          sender: "a37e2836805975f334108b55523634c995bd2a4db610062f404510617e83126f",
          signature:
            "3a4af7fdc9c985a7abd6697c40eca8bf88611d739395280a3ab918e4df97d75f4489ec394da6e21c9ad7a634cc067339fba291acbcd78f6b98d430146e312a05",
        },
      ],
    };
    createMockResponse(result);
    expect(await defaultBank.getBlocks()).toEqual(result);
  });

  it("getConfig()", async () => {
    const result = {
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
    };
    createMockResponse(result);
    expect(await defaultBank.getConfig()).toEqual(result);
  });
});
