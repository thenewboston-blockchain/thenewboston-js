# Bank

In this section, we will discuss how to create banks and work with them.

## Creating Banks

Creating banks is pretty straightforward, all we need to do is create an instance of the `Bank` class like this.

```ts
// Instantiates a new bank
const bank = new Bank("https://localhost:3000");
```

The string which was passed in is the _url_ parameter. This is the url where your bank is located, it could be your ec2 instance address, the digital ocean droplet address, or wherever your bank is.

Now, we can see that we get the same url that we passed in.

```ts
console.log(bank.url);
// `https://localhost:3000`
```

You probably know that there is another parameter that can be passed when creating a bank. This is optional.

Even if you don't pass in an options object, there will be a default one.

```ts
console.log(bank.options);
// { defaultPagination: { limit: 20, offset: 0 } }
```

With the following, you can pass in your own object.

```ts
const bank = new Bank("https://localhost:3000", { defaultPagination: { limit: 10, offset: 0 } });
console.log(bank.options);
// { defaultPagination: { limit: 10, offset: 0 } }
```

> The defaultPagination object is used as default options, when we make API calls later.

## Getting Config

We use `Bank.getConfig` to get the config of the bank. It does not take any parameters.

```ts
const config = await bank.getConfig();
console.log(config);
// {
//   "primary_validator": {
//     "account_number": "2e86f48216567302527b69eae6c6a188097ed3a9741f43cc3723e570cf47644c",
//     "ip_address": "54.183.17.224",
//     "node_identifier": "2262026a562b0274163158e92e8fbc4d28e519bc5ba8c1cf403703292be84a51",
//     "port": null,
//     "protocol": "http",
//     "version": "v1.0",
//     "default_transaction_fee": 1,
//     "root_account_file": "https://gist.githubusercontent.com/buckyroberts/0688f136b6c1332be472a8baf10f78c5/raw/323fcd29672e392be2b934b82ab9eac8d15e840f/alpha-00.json",
//     "root_account_file_hash": "0f775023bee79884fbd9a90a76c5eacfee38a8ca52735f7ab59dab63a75cbee1",
//     "seed_block_identifier": "",
//     "daily_confirmation_rate": null,
//     "trust": "100.00"
//   },
//   "account_number": "dfddf07ec15cbf363ecb52eedd7133b70b3ec896b488460bcecaba63e8e36be5",
//   "ip_address": "143.110.137.54",
//   "node_identifier": "6dbaff44058e630cb375955c82b0d3bd7bc7e20cad93e74909a8951f747fb8a4",
//   "port": null,
//   "protocol": "http",
//   "version": "v1.0",
//   "default_transaction_fee": 1,
//   "node_type": "BANK"
// }
```

The config includes data like selected primary validator, IP address, port, node identifier and so on.

## Getting and Updating Accounts

We can get the accounts which are linked to the bank with the `Bank.getAccounts` method.

```ts
const bank = new Bank("http://143.110.137.54");
const accounts = await bank.getAccounts();
console.log(accounts);
// {
//   count: 98,
//   next: 'http://143.110.137.54/accounts?limit=20&offset=20',
//   previous: null,
//   results: [
//     {
//       id: '5a8c7990-393a-4299-ae92-2f096a2c7f43',
//       created_date: '2020-10-08T02:18:07.346849Z',
//       modified_date: '2020-10-08T02:18:07.346914Z',
//       account_number: 'a37e2836805975f334108b55523634c995bd2a4db610062f404510617e83126f',
//       trust: '0.00'
//     },
//     {
//       id: '2682963f-06b1-47d7-a2e1-1f8ec6ae98dc',
//       created_date: '2020-10-08T02:39:44.071810Z',
//       modified_date: '2020-10-08T02:39:44.071853Z',
//       account_number: 'cc8fb4ebbd2b9a98a767e801ac2b0d296ced88b5d3b7d6d6e12e1d2d7635d724',
//       trust: '0.00'
//     },
//    ....18 more accounts
//   ]
// }
```

We can also update the trust of a specific account.

This is an API call to update the level of trust of a specific account. We use `Bank.updateAccountTrust` for this.

```ts
const account = new Account("0cdd4ba04456ca169baca3d66eace869520c62fe84421329086e03d91a68acdb", "fakeSigningKeyHex");
const res = await bank.updateAccountTrust(
  "0cdd4ba04456ca169baca3d66eace869520c62fe84421329086e03d91a68acdb",
  32,
  account
);
console.log(res);
// {
//   "id": "64426fc5-b3ac-42fb-b75b-d5ccfcdc6872",
//   "created_date": "2020-07-14T02:59:22.204580Z",
//   "modified_date": "2020-07-21T00:58:01.013685Z",
//   "account_number": "0cdd4ba04456ca169baca3d66eace869520c62fe84421329086e03d91a68acdb",
//   "trust": "32"
// }
```

Now the trust of the account supplied would be 32 instead of whatever it was before.

## Options Object

As you can see in the previous section, `bank.getAccount` returns a bunch of accounts with some extra data like count, next, and previous. This is where the options object plays in.

Since we didn't specify the options object at all in this code, the default one - `{ defaultPagination: { limit: 20, offset: 0 } }` is used.

However, if we do pass in our own options object, we can customize the `offset` and `limit` for each API call.

```ts
const bank = new Bank("http://143.110.137.54", { defaultPagination: { limit: 2, offset: 0 } });
const accounts = await bank.getAccounts();
console.log(accounts);
// {
//   count: 98,
//   next: 'http://143.110.137.54/accounts?limit=20&offset=2',
//   previous: null,
//   results: [
//     {
//       id: '5a8c7990-393a-4299-ae92-2f096a2c7f43',
//       created_date: '2020-10-08T02:18:07.346849Z',
//       modified_date: '2020-10-08T02:18:07.346914Z',
//       account_number: 'a37e2836805975f334108b55523634c995bd2a4db610062f404510617e83126f',
//       trust: '0.00'
//     },
//     {
//       id: '2682963f-06b1-47d7-a2e1-1f8ec6ae98dc',
//       created_date: '2020-10-08T02:39:44.071810Z',
//       modified_date: '2020-10-08T02:39:44.071853Z',
//       account_number: 'cc8fb4ebbd2b9a98a767e801ac2b0d296ced88b5d3b7d6d6e12e1d2d7635d724',
//       trust: '0.00'
//     },
//    ....only 2 accounts
//   ]
// }
```

As expected, we can also pass in the options object in the API call itself.

```ts
await bank.getAccounts({ limit: 10, offset: 30 });
```

> The options object passed into the API call has higher precedence than the one passed into the bank constructor.

> The behavior of the options object is similar with all API calls.

## Getting Transactions

Getting a list of transactions is fairly similar to [Getting Accounts](#getting-and-updating-accounts).

We can get the banks transactions with the `Bank.getTransactions` method.

```ts
const bank = new Bank("http://143.110.137.54");
const transactions = await bank.getTransactions();
console.log(transactions);
// {
//   "count": 20,
//   "next": "http://143.110.137.54/bank_transactions?limit=2&offset=20",
//   "previous": null,
//   "results": [
//     {
//       "id": "a7fb060d-e442-4dd4-8604-3b0e67f691aa",
//       "block": {
//         "id": "167707b6-ad59-4b59-9bae-875b0cd604e0",
//         "created_date": "2020-11-20T08:11:05.091231Z",
//         "modified_date": "2020-11-20T08:11:05.091279Z",
//         "balance_key": "2088e602b6b742ff9d47495730a22e03841f46accd911541c413b7ef421a62f9",
//         "sender": "f0fe0fdff41db888a0938882502ee809f6874c015aa09e11e38c8452d4175535",
//         "signature": "74508c8a2ca9810938b10443862d2f875375f6e67a9472e5ffcb03dd51d35c485dbf91577a0978e05825c7c2a7a4fcc15623d0573fe48f980c7ccf5e7d55b304"
//       },
//       "amount": 1,
//       "recipient": "dfddf07ec15cbf363ecb52eedd7133b70b3ec896b488460bcecaba63e8e36be5"
//     },
//     {
//       "id": "14330e7d-729a-4f22-b277-28d368ac46cc",
//       "block": {
//         "id": "74b9d153-aca8-46b0-9c82-55a1e0dd4958",
//         "created_date": "2020-11-20T07:43:34.261742Z",
//         "modified_date": "2020-11-20T07:43:34.261789Z",
//         "balance_key": "e9321848d3f496bd4a5713b892c0a2c229c64b5a5fa2d2f56f33f3bd6aea5d80",
//         "sender": "addf211d203c077bc5c6b78f41ddc68481804539de4bd3fd736fa853514551c0",
//         "signature": "19726b9acc9b77fd5a8f1828e27f7b81db22d9ed3c8f1f267aaddbe1573bfbcfa80fe95bfb88b7f1d54e5736039760762723a6c017e3af9e92d4ef609b850406"
//       },
//       "amount": 1,
//       "recipient": "2e86f48216567302527b69eae6c6a188097ed3a9741f43cc3723e570cf47644c"
//     },
//    ....18 more transactions
//   ]
// }
```

> Just like with `Bank.getAccounts`, you can also pass in an options object here.

## Getting Banks and Updating Trust

This is similar to the [previous section](#getting-transactions), we are just making an API call.

We use `Bank.getBanks` to get all the connected banks.

```ts
const bank = new Bank("http://143.110.137.54");
const banks = await bank.getBanks();
console.log(banks);
// {
//   "count": 20,
//   "next": "http://143.110.137.54/banks?limit=2&offset=20",
//   "previous": null",
//   "results": [
//     {
//       "account_number": "da8500cb8e2ffd728f919cfae82b1c4e97ca2558f2545ab1b020a4172642dce3",
//       "ip_address": "34.202.233.224",
//       "node_identifier": "3d6de056dc9ecbca2b4c832017dcb5dbdc2c95dd3175244acf7dfbc21add76de",
//       "port": 80,
//       "protocol": "http",
//       "version": "v1.0",
//       "default_transaction_fee": 1,
//       "trust": "0.00"
//     },
//     {
//       "account_number": "c4caa42b2a01b31ee187468ac63bd64745f67ec3b20191a54eb55ba20d5adbb0",
//       "ip_address": "18.191.29.186",
//       "node_identifier": "8990b681d8d14b3bf2cd38782c6053bb365cc54616f06ec8d88d9dadb8aa0780",
//       "port": 80,
//       "protocol": "http",
//       "version": "v1.0",
//       "default_transaction_fee": 1,
//       "trust": "0.00"
//     },
//     ...18 more banks
//   ]
// }
```

> As expected, the options object can also be used with this.

#### Getting a single Bank

The `getBank()` method is used to get a specified bank of the bank.

```ts
const bankNodeId = "//   node_identifier: '59af0721c572e6032b835722b5fec22110daad069dc135f1e81794747dbe626f',
";

const res = await bank.getBank(bankNodeId);
console.log(res);

// {
//   account_number: '9a275161478536d0a5b88ff05d429b9a9e63d0032a46e7a6a8f088da89c69da5',
//   ip_address: '13.57.215.62',
//   node_identifier: '59af0721c572e6032b835722b5fec22110daad069dc135f1e81794747dbe626f',
//   port: 80,
//   protocol: 'http',
//   version: 'v1.0',
//   default_transaction_fee: 1,
//   trust: '50.00'
// }
```

#### Updating Bank Trust

We can also update the trust of a specific bank by using the `updateBankTrust` method.

```ts
const networkIdKeyPair = new Account("fakeSigningKeyHex");

const bankToUpdate = "0cdd4ba04456ca169baca3d66eace869520c62fe84421329086e03d91a68acdb";

const res = await bank.updateAccountTrust(bankToUpdate, 50, networkIdKeyPair);

console.log(res);
// {
//   account_number: 'd62165ea6102a74fd484176226cd6ed8f7fc779117138e3ee2d9881ff4fc5a04',
//   ip_address: '144.126.219.17',
//   node_identifier: '38ce9d9a245b2c5c923b1a6e8bbf5324a8cd57d71c977aef6a457740d7fd6451',
//   port: 80,
//   protocol: 'http',
//   version: 'v1.4',
//   default_transaction_fee: 1,
//   root_account_file: 'http://144.126.219.17:80/media/root_account_file.json',
//   root_account_file_hash: 'ab9b95e5bb1dc66dd57ebf2cb8a8dece41748389d68077f74c916659f4bd2f1b',
//   seed_block_identifier: '',
//   daily_confirmation_rate: 1,
//   trust: '50.00'
// }
```

<br>

## Getting and Adding Blocks

Getting a list of blocks is quite similar to all the previous API calls. For this, we use `Bank.getBlocks`.

```ts
const blocks = await bank.getBlocks();
console.log(res);
// {
//   "count": 20,
//   "next": "http://143.110.137.54/blocks?limit=2&offset=20",
//   "previous": null,
//   "results": [
//     {
//       "id": "c6fc11cf-8948-4d32-96c9-d56caa6d5b24",
//       "created_date": "2020-10-08T02:18:07.324999Z",
//       "modified_date": "2020-10-08T02:18:07.325044Z",
//       "balance_key": "a37e2836805975f334108b55523634c995bd2a4db610062f404510617e83126f",
//       "sender": "a37e2836805975f334108b55523634c995bd2a4db610062f404510617e83126f",
//       "signature": "a2ba346d98cb1f7ce6bf017240d674a9928796ddb564a2c8817e68ead0ea02d960e970fe581c6d3a25b9876e1873d51c882b23d843e32f511d9575ef60d2940d"
//     },
//     {
//       "id": "797b7324-905f-42e1-95a3-df918d01e3b0",
//       "created_date": "2020-10-08T02:18:48.575966Z",
//       "modified_date": "2020-10-08T02:18:48.576030Z",
//       "balance_key": "92b9360e31f5ae4fa074ee5e03322aff6c275872e2afc31fbd523f022f18e421",
//       "sender": "a37e2836805975f334108b55523634c995bd2a4db610062f404510617e83126f",
//       "signature": "54875b5fa4db317133b7195d5afa43e5d7c7659970b5c07f7408fb43524573ee0db3078daffa3a5fc341c6851a85c5128d8a79b8f71d5f7d87e275ccca1e8408"
//     },
//    ...18 more blocks
//   ]
// }
```

> The options object can also be passed into this method.

We can also add blocks.

Adding Blocks is also basically an API call, but we have more options this time.

```ts
const bank = new tnb.Bank("http://143.110.137.54");
const transactionsData = await bank.getTransactions();
const transactions = transactionsData.results.map(({ amount, recipient }) => ({
  // Destructuring
  amount,
  recipient,
}));
const result = await bank.addBlocks(
  "fakeBalanceLock",
  transactions,
  new tnb.Account("fakeSigningKey", "fakeAccountNumber")
);
console.log(result);
// {
//   "id": "3ff4ebb0-2b3d-429b-ba90-08133fcdee4e",
//   "created_date": "2020-07-09T21:45:25.909512Z",
//   "modified_date": "2020-07-09T21:45:25.909557Z",
//   "balance_key": "ce51f0d9facaa7d3e69657429dd3f961ce70077a8efb53dcda508c7c0a19d2e3",
//   "sender": "0cdd4ba04456ca169baca3d66eace869520c62fe84421329086e03d91a68acdb",
//   "signature": "ee5a2f2a2f5261c1b633e08dd61182fd0db5604c853ebd8498f6f28ce8e2ccbbc38093918610ea88a7ad47c7f3192ed955d9d1529e7e390013e43f25a5915c0f"
// }
```

Okay so this code seems a bit daunting, but don't worry, it's pretty simple if we go line by line.

The first line is initializing the bank of course.

In the second line we are getting a list of transactions, which are used to create a block.

The third line is mapping the list of transactions to the `{ amount, recipient }` object, to make the data usable.

And in the last line, we are passing in fake values, with the transactions we got before, to add a block to the network.

> If you don't understand why and what we are doing here, I suggest watching a [tutorial](https://youtu.be/Dgj_OStjD1Q) on Youtube.

> This method doesn't support the options object, since it only returns one block and has no need of pagination.

## Getting Confirmation and Invalid Blocks

This section is quite similar to the [Getting Blocks](#getting-and-adding-blocks) section.

```js
const confirmationBlocks = await bank.getConfirmationBlocks();
const invalidBlocks = await bank.getInvalidBlocks();
console.log(confirmationBlocks);
// {
//   "count": 20,
//   "next": "http://143.110.137.54/confirmation_blocks?limit=20&offset=20",
//   "previous": null,
//   "results": [
//     {
//       "id": "e7c5c2e0-8ed1-4eb3-abd8-97fa2e5ca8db",
//       "created_date": "2020-10-08T02:18:07.908635Z",
//       "modified_date": "2020-10-08T02:18:07.908702Z",
//       "block_identifier": "824614aa97edb391784b17ce6956b70aed31edf741c1858d43ae4d566b2a13ed",
//       "block": "c6fc11cf-8948-4d32-96c9-d56caa6d5b24",
//       "validator": "e2a138b0-ebe9-47d2-a146-fb4d9d9ca378"
//     },
//     {
//       "id": "78babf4b-74ed-442e-b5ab-7b23345c18f8",
//       "created_date": "2020-10-08T02:18:07.998146Z",
//       "modified_date": "2020-10-08T02:18:07.998206Z",
//       "block_identifier": "824614aa97edb391784b17ce6956b70aed31edf741c1858d43ae4d566b2a13ed",
//       "block": "c6fc11cf-8948-4d32-96c9-d56caa6d5b24",
//       "validator": "97a878ac-328a-47b6-ac93-be6deee75d94"
//     },
//     ...18 more confirmationBlocks
//   ]
// }

console.log(invalidBlocks);
// {
//   "count": 20,
//   "next": "http://143.110.137.54/invalid_blocks?limit=20&offset=20",
//   "previous": null,
//   "results":
//   [
//     {
//       "id": "2bcd53c5-19f9-4226-ab04-3dfb17c3a1fe",
//       "created_date": "2020-07-11T18:44:16.518695Z",
//       "modified_date": "2020-07-11T18:44:16.518719Z",
//       "block_identifier": "65ae26192dfb9ec41f88c6d582b374a9b42ab58833e1612452d7a8f685dcd4d5",
//       "block": "3ff4ebb0-2b3d-429b-ba90-08133fcdee4e",
//       "confirmation_validator": "fcd2dce8-9e4f-4bf1-8dac-cdbaf64e5ce8",
//       "primary_validator": "51461a75-dd8d-4133-81f4-543a3b054149"
//     },
//     {
//       "id": "c6fc11cf-8948-4d32-96c9-d56caa6d5b24",
//       "created_date": "2020-07-11T19:44:16.518695Z",
//       "modified_date": "2020-07-11T19:44:16.518719Z",
//       "block_identifier": "5da3758cdd6b2c9d5ed60471f15654622bc5eae047d71d995c0df3180e6097c0",
//       "block": "402d5976-cbaa-4d89-b5d7-bddfe0aa5a3d",
//       "confirmation_validator": "fcd2dce8-9e4f-4bf1-8dac-cdbaf64e5ce8",
//       "primary_validator": "51461a75-dd8d-4133-81f4-543a3b054149"
//     },
//    ...18 more invalidBlocks
//   ]
// }
```

We use `Bank.getConfirmationBlocks` to get the confirmation blocks and `Bank.getInvalidBlocks`

> Both of these methods support the options object

## Getting Validators and Updating Trust

The `Bank.getValidators` method is used to get all connected validators of the bank.

```ts
const res = await bank.getValidators();
console.log(res);
// {
//   "count": 20,
//   "next": "http://54.219.178.46/validators?limit=20&offset=20",
//   "previous": null,
//   "results": [
//     {
//       "account_number": "4699a423c455a40feb1d6b90b167584a880659e1bf9adf9954a727d534ff0c16",
//       "ip_address": "54.219.178.46",
//       "node_identifier": "b1b232503b3db3975524faf98674f22c83f4357c3d946431b8a8568715d7e1d9",
//       "port": null,
//       "protocol": "http",
//       "version": "v1.0",
//       "default_transaction_fee": 1,
//       "root_account_file": "http://54.219.178.46/media/root_account_file.json",
//       "root_account_file_hash": "cc9390cc579dc8a99a1f34c1bea5d54a0f45b27ecee7e38662f0cd853f76744d",
//       "seed_block_identifier": "",
//       "daily_confirmation_rate": 1,
//       "trust": "100.00"
//     },
//     {
//       "account_number": "2e86f48216567302527b69eae6c6a188097ed3a9741f43cc3723e570cf47644c",
//       "ip_address": "54.183.17.224",
//       "node_identifier": "2262026a562b0274163158e92e8fbc4d28e519bc5ba8c1cf403703292be84a51",
//       "port": null,
//       "protocol": "http",
//       "version": "v1.0",
//       "default_transaction_fee": 1,
//       "root_account_file": "http://54.183.17.224/media/root_account_file.json",
//       "root_account_file_hash": "cc9390cc579dc8a99a1f34c1bea5d54a0f45b27ecee7e38662f0cd853f76744d",
//       "seed_block_identifier": "",
//       "daily_confirmation_rate": null,
//       "trust": "100.00"
//     },
//    ...18 more validators
//   ]
// }
```

#### Getting a single Validator

The `getValidator()` method is used to get a specified validator of the bank.

```ts
const validatorNodeId = "01181490ac0fa6f73bd980adb81f1a3e72f81eb6b4ccab4dac8b6db7544e5eb1";

const res = await bank.getValidator(validatorNodeId);
console.log(res);

// {
//   account_number: 'd2018eb4a13ea1ed307aa8f73207bc1cbad3fac0070899ff5af158982ae7a804',
//   ip_address: '18.218.193.164',
//   node_identifier: '01181490ac0fa6f73bd980adb81f1a3e72f81eb6b4ccab4dac8b6db7544e5eb1',
//   port: 80,
//   protocol: 'http',
//   version: 'v1.0',
//   default_transaction_fee: 1,
//   trust: '100.00'
// }
```

#### Updating Validator Trust

We can also update the trust of a specific validator by using the `updateValidatorTrust` method.

```ts
const networkIdKeyPair = new Account("validatorNetworkIdSigningKey");

const validatorToUpdate = "38ce9d9a245b2c5c923b1a6e8bbf5324a8cd57d71c977aef6a457740d7fd6451";

const res = await bank.updateAccountTrust(validatorToUpdate, 12, networkIdKeyPair);

console.log(res);
// {
//   account_number: 'd62165ea6102a74fd484176226cd6ed8f7fc779117138e3ee2d9881ff4fc5a04',
//   ip_address: '144.126.219.17',
//   node_identifier: '38ce9d9a245b2c5c923b1a6e8bbf5324a8cd57d71c977aef6a457740d7fd6451',
//   port: 80,
//   protocol: 'http',
//   version: 'v1.4',
//   default_transaction_fee: 1,
//   root_account_file: 'http://144.126.219.17:80/media/root_account_file.json',
//   root_account_file_hash: 'ab9b95e5bb1dc66dd57ebf2cb8a8dece41748389d68077f74c916659f4bd2f1b',
//   seed_block_identifier: '',
//   daily_confirmation_rate: 1,
//   trust: '12.00'
// }
```

<br>

## Getting Validator Confirmation Services

We use `Bank.getValidatorConfirmationServices` to get all the Validator Confirmation Services of the bank.

```ts
const validatorConfirmationServices = await bank.getValidatorConfirmationServices();
console.log(validatorConfirmationServices);
// [
//   {
//     "id": "be9fbc3b-d4df-43d5-9bea-9882a6dd27f6",
//     "created_date": "2020-07-09T22:10:35.312956Z",
//     "modified_date": "2020-07-09T22:10:37.393578Z",
//     "end": "2020-08-09T22:10:24Z",
//     "start": "2020-07-09T22:10:25Z",
//     "validator": "51461a75-dd8d-4133-81f4-543a3b054149"
//   },
//   {
//     "id": "e2055637-67ff-4479-aec6-a8095d513862",
//     "created_date": "2020-07-09T22:10:35.312956Z",
//     "modified_date": "2020-07-09T22:10:37.393578Z",
//     "end": "2020-08-09T22:10:24Z",
//     "start": "2020-07-09T22:10:25Z",
//     "validator": "10308b02-d577-484e-953c-0a2bdb5e3d83"
//   }
// ]
```

> This method also supports an options object

> Check [this](https://thenewboston.com/guide/confirmation-services) out to get a better overview of Confirmation Services

## Sending Upgrade Notice and Upgrade Request

An upgrade request is basically the bank asking one of its confirmation validators to become the primary validator after changing the trust values.

We can send an upgrade request using the `Bank.sendUpgradeRequest` method.

```ts
const bank = new tnb.Bank("http://143.110.137.54");
const res = await bank.sendUpgradeRequest("fdasfsafdsa", new Account()); // Fake data, causes a 404 error
console.log(res);
// No response
```

We send an upgrade request with the `node_identifier` string and the connected `account` of the validator.

An upgrade notice is when a bank is asking another bank whether they have switched to the new primary validator or not.

We send an upgrade notice with the `Bank.sendUpgradeNotice` method.

```ts
const res = await bank.sendUpgradeNotice("fewafdsa3243ewdsvgsf", new tnb.Account()); // Fake data will result in status code 401
console.log(res);
// No response
// Status Code 200 if the bank has set the new Primary Validator
// Status Code 400 is the bank has not set the new Primary Validator
```

> If you don't understand upgradeRequest and upgradeNotice, check out the [documentation](https://thenewboston.com/guide/resync-process) at thenewboston.com

## Getting the Bank's Primary Validator

Simply use the `Bank.getBankPV` method which returns the formatted url of the Primary Validator

```ts
const bank = new tnb.Bank("http://143.110.137.54");
const pv = await bank.getBankPV();
```

## Getting the Bank's Transaction Fee

Use the `Bank.getTxFee` method to get the transaction fee

```ts
const bank = new tnb.Bank("http://143.110.137.54");
console.log(await bank.getTxFee());
// 1
```

## Crawl

A network crawl is the process of browsing nodes in order to discover new one. A crawl can be triggered by any client, given that it knows the Node's signing key.

### Retrieve Crawl Status

To retrieve the current crawl status of the bank we can use the `getCrawlStatus()` method

```ts
const crawlStatus = bank.getCrawlStatus();

console.log(crawlStatus);

//  {
//   crawl_last_completed: '2021-03-29 14:07:26.218216+00:00',
//   crawl_status: 'crawling',
//   ip_address: '18.218.193.164',
//   port: 80,
//   protocol: 'http'
// }
```

### Start Crawl

To initiate a network crawl we need to send a request to the bank using the `startCrawl()` method

```ts
const account = new Account("BankNetworkIdSigingKey");

const response = bank.startCrawl(account);

console.log(response);

//  {
//   crawl_last_completed: '2021-03-29 14:07:26.218216+00:00',
//   crawl_status: 'crawling',
//   ip_address: '18.218.193.164',
//   port: 80,
//   protocol: 'http'
// }
```

### Stopping Crawl

To stop the network crawl process we can send a request to the bank using the `stopCrawl()` method

```ts
const account = new Account("BankNetworkIdSigingKey");

const response = bank.stopCrawl(account);

console.log(response);

// {
//   crawl_last_completed: '2021-03-29 14:20:29.265859+00:00',
//   crawl_status: 'stop_requested',
//   ip_address: '18.218.193.164',
//   port: 80,
//   protocol: 'http'
// }
```

## Clean

A network clean is the process of updating the network (mainly to remove disconected nodes). A clean can be triggered by any client, given that it knows the Node's signing key.

### Retrieve Clean Status

To retrieve the current clean status of the bank we can use the `getCleanStatus()` method

```ts
const cleanStatus = bank.getCleanStatus();

console.log(cleanStatus);

//  {
//   clean_last_completed: '2021-03-29 14:07:26.218216+00:00',
//   clean_status: 'cleaning',
//   ip_address: '18.218.193.164',
//   port: 80,
//   protocol: 'http'
// }
```

### Start Clean

To initiate a network clean we need to send a request to the bank using the `startClean()` method

```ts
const account = new Account("BankNetworkIdSigingKey");

const response = bank.startClean(account);

console.log(response);

//  {
//   clean_last_completed: '2021-03-29 14:07:26.218216+00:00',
//   clean_status: 'cleaning',
//   ip_address: '18.218.193.164',
//   port: 80,
//   protocol: 'http'
// }
```

### Stopping Clean

To stop the network clean process we can send a request to the bank using the `stopClean()` method

```ts
const account = new Account("BankNetworkIdSigingKey");

const response = bank.stopClean(account);

console.log(response);

// {
//   clean_last_completed: '2021-03-29 14:20:29.265859+00:00',
//   clean_status: 'stop_requested',
//   ip_address: '18.218.193.164',
//   port: 80,
//   protocol: 'http'
// }
```
