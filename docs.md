# Documentation

Here, you will learn about how to use all of what thenewboston-js has to offer. If you notice an error or typo, then please create a pull request yourself and we can pull in the changes to save everyone some time.

## Getting Started

Currently, the only way to use the library is to clone the repository and download the files while loading them into your project. We will upload this the library to [npm](https://npmjs.com).

> For simplicity, we will not be including `import` or `require` statements in our examples.

## Table of Contents

- [Account](#account)

  - [Creating Accounts](#creating-and-updating-accounts)

  - [Getting Account Numbers and Signing Keys](#getting-account-numbers-and-signing-keys)

  - [Creating Signatures](#creating-signatures)

  - [Using Signed Data and Signed Messages](#using-signed-data-and-signed-messages)

  - [Using Block Data and Block Messages](#using-block-data-and-block-messages)

- [Bank](#bank)

  - [Creating Banks](#creating-banks)

  - [Getting Config](#getting-config)

  - [Getting and Updating Accounts](#getting-and-updating-accounts)

  - [Options Object](#options-object)

  - [Getting Transactions](#getting-transactions)

  - [Getting Banks](#getting-banks)

  - [Getting and Adding Blocks](#getting-and-adding-blocks)

  - [Getting Confirmation and Invalid Blocks](#getting-confirmation-and-invalid-blocks)

  - [Getting Validators and Validator Confirmation Services](#getting-validators-and-validator-confirmation-services)

  - [Sending Upgrade Notice and Upgrade Request](#sending-upgrade-notice-and-upgrade-request)

- [Validator](#validator)

  - [Creating Validators](#creating-banks)

  - [Working With Accounts](#working-with-accounts)

  - [Working With Other Nodes](#working-with-other-nodes)

  - [Working With Blocks](#working-with-blocks)

- [Primary Validator](#primary-validator)

  - [Adding Bank Blocks](#adding-bank-blocks)

- [Confirmation Validator](#confirmation-validator)

### Account

In this section, we will discuss how to create accounts and use them within other parts of your code with ease.

#### Creating Accounts

Creating local accounts with thenewboston-js is extremely simple. All you have to do is access the `Account` class from the library. These accounts are also used when updating thenewboston server nodes (banks + validators) with requests. Here is a simple example of us using the `Account` class:

```ts
// Generates a random account with a random hex signing key string.
const account = new Account();

account.accountNumberHex; // random account number hex string
account.signingKeyHex; // random account signing key hex string
```

As you can tell, if you don't pass in anything into the `Account` class, then it just generates a random account for you. Now, let's get a little more complex, you can pass in the `signingKey` as the first parameter within `Account` and it will set the `signingKeyHex` of the `Account` as it. Also, since we are using the signing-based cryptographic algorithms, the `accountNumberHex` can be generated automatically. Here is an example of this behavior in action:

```ts
const accountSigningKey = "61647c0dd309646ea5b3868c8c237158483a10484b0485663e4f82a68a10535e";
const account = new Account(accountSigningKey);

account.accountNumberHex; // the corresponding account number hex
account.signingKeyHex; // the account signing key
```

> Remember: You **must** keep your account signing key secret at all times. If someone obtains your signing key, then your account is compromised along with all of its funds.

Alright, so we have checked out all of the other ways of instantiating an `Account` with this library, but we haven't learned how to give it both the `accountNumber` and `signingKey`. To do that, you must pass in the `signingKey` first, with the `accountNumber` second. Here is an example of that in the wild:

```ts
const accountData = {
  signingKey: "61647c0dd309646ea5b3868c8c237158483a10484b0485663e4f82a68a10535e",
  accountNumber: "0fa2596d9fada397a6668463fed71c8c7260a411d108da6480d65121d443cc58",
};

const account = new Account(accountData.signingKey, accountData.accountNumber);

account.accountNumberHex; // the account number
account.signingKeyHex; // the account signing key
```

#### Getting Account Numbers and Signing Keys

Obviously, this was used in the earlier examples when we were getting the account number and signing key as a hex string. Here is an example of us getting the `accountNumberHex` and `signingKeyHex` of a random `Account`:

```ts
const account = new Account();

account.accountNumberHex; // the account number hex string
account.signingKeyHex; // the account signing key hex string
```

> An important thing to note is that a hex is _just a number_ with a different base. However, when you get these account numbers and signing keys as a hex, we actually just convert the hex value to a hex string instead of an array of numbers ([Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)). Check out [this article by sparkfun](https://learn.sparkfun.com/tutorials/hexadecimal/all) for more information.

#### Creating Signatures

In this section, we will learn how to create signatures for a given `Account` using the `createSignature` method for a `message`.

> If you don't understand what these signatures and private/public keys _really_ are, then check out [this article by Prevail on the topic](https://www.preveil.com/blog/public-and-private-key/).

The `createSignature` method just takes in one parameter: a `string` that is the message to generate a signature for. Here is an example of us signing `"Hello, world"`:

```ts
const account = new Account();
account.createSignature("Hello, world!"); // the generated signature generated using the account's `signingKey` and `message`
```

From running that code, you can see that the `createSignature` method returned a long hex string signature.

> If you re-run that code multiple times, you will then notice that the generated signature is different. That is because the signature depends on two variables: the account signing key and the message. The account signing key also is changing on every run because we are generating a random `Account` to use, thus resulting in different outcomes.

#### Using Signed Data and Signed Messages

We have already talked about creating signatures, so let's learn how we can apply them to creating signed data and signed messages. Signed data and signed messages are very similar, with the only difference being that signed messages have an extra `node_identifier` property. Here is an example of us creating signed data and a signed message:

> Note that all of the `signature` and `node_identifier` properties that we are generating are _almost_ random as we are not passing any arguments into the `Account` class.

```ts
const account = new Account();

account.createSignedData({ name: "Bacon" });

// {
//   data: { name: 'Bacon' },
//   signature: '68202fd5336c57dd42ba116fbf4154b7ef797473c7bc04949fef943c37b7b448ababf22c94711cd5f0fc603f5bd7d10d4e96dff9c876599de9fe887dfffe6d01'
// }

account.createSignedMessage({ name: "Tuna" });

// {
//   data: { name: 'Tuna' },
//   node_identifier: '660030bd47e777683f5376b0ce672a8427b1b1201ac9af4726766738edeb3c2e',
//   signature: '68202fd5336c57dd42ba116fbf4154b7ef797473c7bc04949fef943c37b7b448ababf22c94711cd5f0fc603f5bd7d10d4e96dff9c876599de9fe887dfffe6d01'
// }
```

If you were to log out `account`'s `accountNumberHex`, then you would realize that the `node_identifier` is just that account. The reason for that is because only servers have the account signing key to be able to authenticate their requests.

### Using Block Data and Block Messages

Block messages are used to add more transactions to the blockchain. Block data, however, should only be used when you are trying to use this library with a different cryptocurrency as it does not include the `signature` generation. Here is an example of us creating a signed block message using the `createBlockMessage` `Account` method with the first parameter being the `balance_lock` and the second being the `transactions`:

```ts
const account = new Account();

account.createBlockMessage("bacon", [
  {
    amount: 23,
    recipient: "tuna",
  },
  {
    amount: 2,
    recipient: "baconandtuna",
  },
]);
```

As you can tell after running the code and logging out the method, we get the following output in our console:

```ts
{
  account_number: '132953bbaa261b36d0c957751da5111ef788b9d4a0abcf4de6e41efc7e0f875f',
  message: {
    balance_key: 'asdf',
    txs: [
      {
        amount: 23,
        recipient: "foo",
      },
      {
        amount: 2,
        recipient: "foo2",
      }
    ]
  },
  signature: 'c143255946803dc4b0f86c7ad45f7276b2fc1be243fd0dd2f459140f2bd3a189e9588e6ce40cf1631e80e6c9269ebfac9ca5e7865fdd48a81de3566c0af97501'
}
```

Alright, so that's the `Account` class in a nutshell! If you have any things you would like to add please send a pull request or an issue so we can fix it!

### Bank

In this section, we will discuss how to create banks and work with them.

#### Creating Banks

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

#### Getting Config

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

#### Getting and Updating Accounts

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

This is an API call to update the level of trust of a specific account. We use `Bank.updateAccount` for this.

```ts
const account = new Account("0cdd4ba04456ca169baca3d66eace869520c62fe84421329086e03d91a68acdb", "fakeSigningKeyHex");
const res = await bank.updateAccount("0cdd4ba04456ca169baca3d66eace869520c62fe84421329086e03d91a68acdb", 32, account);
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

#### Options Object

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

#### Getting Transactions

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

#### Getting Banks

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

#### Getting and Adding Blocks

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

#### Getting Confirmation and Invalid Blocks

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

#### Getting Validators and Validator Confirmation Services

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

#### Sending Upgrade Notice and Upgrade Request

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

### Validator

In this section we will be going over the base Validator node that both the Primary Validator and the Confirmation Validator inherit from. This will cover the basic usage of any Validator, but to learn more about where they deviate you can refer to their respective sections.

### Creating Validators

To create a Validator, we must pass in the url of the Validator you wish to interact with, into a constructor.

```ts
// create object with access to the API and basic functions of a Validator.
const primaryValidator = new PrimaryValidator("http://157.230.75.212");
const confirmationValidator = new ConfirmationValidator("http://157.230.10.237");
```

We can check the basic configuration of the Validator with a call to `getConfig`.

```ts
// Get the current config data for each validator.

const primaryValidatorConfig = await primaryValidator.getConfig();
console.log(primaryValidatorConfig);
/*
{
  primary_validator: null,
  account_number: '6649dde16e1e56e27157d32fe37f7534d9f547436605fe44b550f5a7b9473035',
  ip_address: '157.230.75.212',
  node_identifier: '9dd8825ae8bce326df4da8a02ab4345d3f5cb63f579e88018d8b480fdafe2a8d',
  port: null,
  protocol: 'http',
  version: 'v1.0',
  default_transaction_fee: 1,
  root_account_file: 'http://157.230.75.212/media/root_account_file.json',
  root_account_file_hash: 'cc9390cc579dc8a99a1f34c1bea5d54a0f45b27ecee7e38662f0cd853f76744d',
  seed_block_identifier: '',
  daily_confirmation_rate: null,
  node_type: 'PRIMARY_VALIDATOR'
}
*/

const confirmationValidatorConfig = await confirmationValidator.getConfig();
console.log(confirmationValidatorConfig);
/*
{
  primary_validator: {
    account_number: '6649dde16e1e56e27157d32fe37f7534d9f547436605fe44b550f5a7b9473035',
    ip_address: '157.230.75.212',
    node_identifier: '9dd8825ae8bce326df4da8a02ab4345d3f5cb63f579e88018d8b480fdafe2a8d',
    port: null,
    protocol: 'http',
    version: 'v1.0',
    default_transaction_fee: 1,
    root_account_file: 'http://157.230.75.212/media/root_account_file.json',
    root_account_file_hash: 'cc9390cc579dc8a99a1f34c1bea5d54a0f45b27ecee7e38662f0cd853f76744d',
    seed_block_identifier: '',
    daily_confirmation_rate: null,
    trust: '100.00'
  },
  account_number: '4141206a94c0c6115e47c72a35bf5f187c53510b49f47ce04ce68722598d5a73',
  ip_address: '157.230.10.237',
  node_identifier: '5cb75a0415d5b48bf97006fa6d20f4faac67b8ba73de0df0a5253eb9c846a73d',
  port: null,
  protocol: 'http',
  version: 'v1.0',
  default_transaction_fee: 1,
  root_account_file: 'http://157.230.10.237/media/root_account_file.json',
  root_account_file_hash: 'cc9390cc579dc8a99a1f34c1bea5d54a0f45b27ecee7e38662f0cd853f76744d',
  seed_block_identifier: '',
  daily_confirmation_rate: 1,
  node_type: 'CONFIRMATION_VALIDATOR'
}
*/
```

Now we know how to create a Validator and access its configurations in our code, we can move on to the methods that work with the accounts that use its services and the other nodes which are on it's network.

### Working With Accounts

To see all the accounts on the network your Validator is connected to, there is a `getAccounts` method. This method will return the total amount of accounts in the `count` property, and you can access more or past `results` with the URL links that the `next` and `previous` properties provide.

```ts
const primaryValidator = new PrimaryValidator("http://157.230.75.212");
const confirmationValidator = new ConfirmationValidator("http://157.230.10.237");

// Make a default call to getAccounts
const allAccounts = await primaryValidator.getAccounts():
console.log(allAccounts);
/*
{
  "count": 411,
  "next": "http://157.230.75.212/accounts?limit=50&offset=50",
  "previous": null,
  "results": [
    {
      "id": "9c6dd61a-438c-4a95-b1d2-33f90bd7f6ad",
      "account_number": "2e86f48216567302527b69eae6c6a188097ed3a9741f43cc3723e570cf47644c",
      "balance": 460,
      "balance_lock": "aca94f4d2f472c6b9b662f60aab247b9c6aef2079d63b870e2cc02308a7c822b"
    }, // for brevity we will show one result but running this code will show 50 accounts before the offset of the 50th account (0-49)
    ... 49 more results
  ]
}
*/

// Pass in optional argument to get the first account listed
const firstAccount = await confirmationValidator.getAccounts({limit:1, offset:0}):
console.log(firstAccount);
/*
{
  "count": 411,
  "next": "http://157.230.10.237/accounts?limit=1&offset=1",
  "previous": null,
  "results": [
    {
      "id": "9c6dd61a-438c-4a95-b1d2-33f90bd7f6ad",
      "account_number": "2e86f48216567302527b69eae6c6a188097ed3a9741f43cc3723e570cf47644c",
      "balance": 460,
      "balance_lock": "aca94f4d2f472c6b9b662f60aab247b9c6aef2079d63b870e2cc02308a7c822b"
    },
  ]
}
*/
```

You can also get the balance and balance lock of a single account with the following methods, given the account number.

```ts
const primaryValidator = new PrimaryValidator("http://157.230.75.212");
const confirmationValidator = new ConfirmationValidator("http://157.230.10.237");

// call to getAccountBalance
const balance = await primaryValidator.getAccountBalance(
  "57c10f3554872103c9b91e481347c2522dd5a13757831a51b12180c09e2e50ce"
);
console.log(balance);
// { balance: 2000 }

// call to getAccountBalanceLock
const balLock = await confirmationValidator.getAccountBalanceLock(
  "57c10f3554872103c9b91e481347c2522dd5a13757831a51b12180c09e2e50ce"
);
console.log(balLock);
// { balance_lock: '57c10f3554872103c9b91e481347c2522dd5a13757831a51b12180c09e2e50ce' }
```

### Working With Other Nodes

We can use the `getValidators` and `getBanks` methods to see what Confimation Validators and Banks are connected to our Validator.

```ts
const primaryValidator = new PrimaryValidator("http://157.230.75.212");
const confirmationValidator = new ConfirmationValidator("http://157.230.10.237");

// See all Confirmation Validators connected to the Primary Validator
const allConfirmationValidators = await primaryValidator.getValidators();
console.log(allConfirmationValidators);
/*
{
  count: 18,
  next: null,
  previous: null,
  results: [
    { // an example of one of the results, this size array will be determined by the count and optional options parameter
      account_number: '30f9ee860f0f9b38e06d1ba25989a527b27220962536b9fe35cf8471f530d52c',
      ip_address: '185.22.172.130',
      node_identifier: 'f48468d2e09db51409ee4f4941e0dd21949c0583c94f364a20a170f4e410be61',
      port: null,
      protocol: 'http',
      version: 'v1.0',
      default_transaction_fee: 1,
      root_account_file: 'http://185.22.172.130/media/root_account_file.json',
      root_account_file_hash: 'cc9390cc579dc8a99a1f34c1bea5d54a0f45b27ecee7e38662f0cd853f76744d',
      seed_block_identifier: '',
      daily_confirmation_rate: 1,
      trust: '0.00'
    },
    .... 17 more results
  ]
}
*/

// See all the Banks connected to this Confirmation Validator
const banks = await confirmationValidator.getBanks();
console.log(banks);
/*
{
  count: 4,
  next: null,
  previous: null,
  results: [
    { // an example of one of the results, this array size will be determined by the count and optional options parameter
      account_number: '7b2a3a94bdbb8911f7da685e3c545e24c862b4440b5fa0768cfbdfbdfb8a9ea4',
      ip_address: '157.230.75.108',
      node_identifier: '477afa979ebeec845a102a50f38ae399b072d56fa7ff229b862210a17d442771',
      port: 80,
      protocol: 'http',
      version: 'v1.0',
      default_transaction_fee: 1,
      confirmation_expiration: null,
      trust: '0.00'
    },
    .... 3 more results 
  ]
}
*/
```

### Working With Blocks

A validator's main purpose is to validate the transactions that a Bank creates. These transactions are called Blocks. All Validators share the `getValidConfirmationBlock` and `getQueuedConfirmationBlock` methods to view the blocks that a Bank is asking them to validate. If you go to your TNB Account Manager, click on a Validator and then its "confirmations", you will see a list of all the confirmed blocks that the Validator processed and if you take the "Block Identifier" and pass it as a string to the `getValidConfirmationBlock` method, you will see the in depth details of a Block.

```ts
const PV = new PrimaryValidator("http://157.230.75.212");
const valConfBlock = await PV.getValidConfirmationBlock(
  "b30231d7b4b3a00222d96340d3e89bb969f0476836402386f8ac334ac456b4ac"
);
console.log(valConfBlock);
/*{
  message: {
    block: {
      account_number: '15e164325715c9552911caf7e3ea1759f4c2ccba5fd82864a4d811d67935c4f9',
      message: {
        balance_key: '8d26ea32062dcb96fbda2b736b180c5435ab7a236e0f555ca32de75fd57627eb',
        txs: [
          {
            amount: 1,
            recipient: '6649dde16e1e56e27157d32fe37f7534d9f547436605fe44b550f5a7b9473035'
          },
          {
            amount: 1,
            recipient: '7b2a3a94bdbb8911f7da685e3c545e24c862b4440b5fa0768cfbdfbdfb8a9ea4'
          },
          {
            amount: 10,
            recipient: '8cec39d67cd5d3e3e487b944b5c7029c6bd51cfcc8855a9fd1e679defe0669f0'
          }
        ],
      },
      signature: '6dcb5dad55497a1b3e87df32194c9de459854f2ec1681dc7dee28d6e00a3a26814464be3a3861893141867b26ee4e9afdb0573872a6a8dffa72c819ad799d00e'
    },
    block_identifier: 'b30231d7b4b3a00222d96340d3e89bb969f0476836402386f8ac334ac456b4ac',
    updated_balances: [
      {
        account_number: '15e164325715c9552911caf7e3ea1759f4c2ccba5fd82864a4d811d67935c4f9',
        balance: 92207,
        balance_lock: '76e6153a051dc305be7c8a30cba630b400506f9f843ec80c2a9f78e926264cad'
      },
      {
        account_number: '6649dde16e1e56e27157d32fe37f7534d9f547436605fe44b550f5a7b9473035',
        balance: 221
      },
      {
        account_number: '7b2a3a94bdbb8911f7da685e3c545e24c862b4440b5fa0768cfbdfbdfb8a9ea4',
        balance: 17
      },
      {
        account_number: '8cec39d67cd5d3e3e487b944b5c7029c6bd51cfcc8855a9fd1e679defe0669f0',
        balance: 10
      }
    ]
  },
  node_identifier: '9dd8825ae8bce326df4da8a02ab4345d3f5cb63f579e88018d8b480fdafe2a8d',
  signature: '0770f2c3c434bf2e88c907e08eda168395fb544d9c33cabc74342db01364e39885ecde1503231cea9fc537e11f8c1028d4aae5f98ea80c2fcfe1ccdd2f6a8b0a'
}*/
```

To get an unconfirmed or queued Block is a little more difficult since the network is very fast, what we would have to do to get that information is have a bank to make a transaction, send it as a Block and then immediately grab the "Block ID" and pass it into the `getQueuedConfirmationBlocks` of a Validator that's services are being used by the bank. Making bank transactions and sending them as blocks is a little out of the scope of this section, but all together it may look like this.

```ts
// let's assume this Confirmation Validator has its services subscribed to by this Bank.
const CV = new ConfirmationValidator("http://157.230.10.237");
const bank = new tnb.Bank("http://143.110.137.54");
const transactionsData = await bank.getTransactions();
const transactions = transactionsData.results.map(({ amount, recipient }) => ({
  // Destructuring
  amount,
  recipient,
}));

await bank.addBlocks("fakeBalanceLock", transactions, new tnb.Account("fakeSigningKey", "fakeAccountNumber"));
/* the above code is explained in the Banks section, and for the sake not being repetitive, 
please refer to the "Adding Blocks" subsection of Banks for explanation of this code*/

// get the last Block ID
const amountOfBlocks = await bank.getConfirmationBlocks().count;
const lastBlockID = await bank.getConfirmationBlocks({ limit = 1, offset = amountOfBlocks }).results[0]
  .block_identifier;

const queuedConfBlock = await CV.getQueuedConfirmationBlock(lastBlockID);
console.log(queuedConfBlock);
/* Not a real output but it is in the same format
{
  "message": {
    "block": {
      "account_number": "fakeAccountNumber",
      "message": {
        "balance_key": "e6a41b658e17ab2db4355176c8160de6a66b07e5cbdd85244b55b38b4fd26e92",
        "txs": [
          {
            "amount": 60,
            "recipient": "484b3176c63d5f37d808404af1a12c4b9649cd6f6769f35bdf5a816133623fbc"
          },
          {
            "amount": 1,
            "recipient": "5e12967707909e62b2bb2036c209085a784fabbc3deccefee70052b6181c8ed8"
          },
          {
            "amount": 4,
            "recipient": "ad1f8845c6a1abb6011a2a434a079a087c460657aad54329a84b406dce8bf314"
          }
        ]
      },
      "signature": "d857184b7d3121a8f9dccab09062fafc82dd0fb30a5d53e19ab25a587171bb9c6b33858353cd3ff7ddc1ad2bfc59a885e85827799bcfc082fd048f9bf34bd404"
    },
    "block_identifier": lastBlockID,
    "updated_balances": [
      {
        "account_number": "0cdd4ba04456ca169baca3d66eace869520c62fe84421329086e03d91a68acdb",
        "balance": 4294967014,
        "balance_lock": "729ce6ce619aeedf260221c7687c51d8a6845fbb5407b11c8cd26eaa7c8a6125"
      },
      {
        "account_number": "484b3176c63d5f37d808404af1a12c4b9649cd6f6769f35bdf5a816133623fbc",
        "balance": 191
      },
      {
        "account_number": "5e12967707909e62b2bb2036c209085a784fabbc3deccefee70052b6181c8ed8",
        "balance": 18
      },
      {
        "account_number": "ad1f8845c6a1abb6011a2a434a079a087c460657aad54329a84b406dce8bf314",
        "balance": 72
      }
    ]
  },
  "node_identifier": "3afdf37573f1a511def0bd85553404b7091a76bcd79cdcebba1310527b167521",
  "signature": "b4d335fa7662216acba06c18d93c6cfb688c8057cbe9193ddc8e6fb3702ba1d979e43b09e06c6c7c38358bbee5243dc37a52c5212298c2259be48285e3da130c"
}
*/
```

This basically puts out the same information as `getVaildConfirmationBlocks` but the difference is that this "queued" block will be deemed valid or invalid soon. The window to see it is very small because of the speed of the network, but if you grab the `block_identifier` of a newly created block you can keep track of it as it hits all the Validators that will be processing it.

### Primary Validator

In this section, we will look at the methods of the `Primary Validator` class, which extends the `Validator` class.

> It is recommended that you read the [documentation for the `Validator` Class](#Validator) first, to understand the base methods before reading this section.

#### Adding Bank Blocks

Bank Blocks are blocks which have been signed by banks to show that they have passed initial validation.

We add Bank blocks via the `PrimaryValidator.addBankBlocks` method.

```ts
const primaryValidator = new tnb.PrimaryValidator("http://157.230.75.212");
const transactions = [
  {
    amount: 1,
    recipient: "fakeAccountNumber",
  },
  {
    amount: 1,
    recipient: "fakeAccountNumber",
  },
  {
    amount: 1,
    recipient: "fakeAccountNumber",
  },
];
const res = await primaryValidator.addBankBlocks("fakeBalanceLock", transactions, new tnb.Account());
```

As you can see, this method takes 3 parameters, the balanceLock of the account you are sending from, the list of transactions, and an account object with the correct accountNumber and signingKey.
