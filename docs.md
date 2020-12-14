# Documentation

Here, you will learn about how to use all of what thenewboston-js has to offer. If you notice an error or typo, then please create a pull request yourself and we can pull in the changes to save everyone some time.

## Getting Started

Currently, the only way to use the library is to clone the repository and download the files while loading them into your project. We will upload this the library is uploaded to [npm](https://npmjs.com).

> For simplicity, we will not be including `import` or `require` statements in our examples.

## Table of Contents

- [Account](#account)

  - [Creating Accounts](#creating-accounts)

  - [Getting Account Numbers and Signing Keys](#getting-account-numbers-and-signing-keys)

  - [Creating Signatures](#creating-signatures)

  - [Using Signed Data and Signed Messages](#using-signed-data-and-signed-messages)

  - [Using Block Data and Block Messages](#using-block-data-and-block-messages)

- [Bank](#bank)

- [Validator](#validator)

  - [Creating Validators](#creating-validators)

  - [Working With Accounts](#working-with-accounts)

  - [Working With Other Nodes](#working-with-other-nodes)

  - [Working With Blocks](#working-with-blocks)

- [Primary Validator](#primary-validator)

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

As you can tell, if you don't pass in anything into the `Accocunt` class, then it just generates a random account for you. Now, let's get a little more complex, you can pass in the `signingKey` as the first parameter within `Account` and it will set the `signingKeyHex` of the `Account` as it. Also, due to the fact that we are using the signing-based cryptographic algorithms, the `accountNumberHex` is able to be generated automatically. Here is an example of this behavior in action:

```ts
const accountSigningKey = "61647c0dd309646ea5b3868c8c237158483a10484b0485663e4f82a68a10535e";
const account = new Account(accountSigningKey);

account.accountNumberHex; // the corresponding account number hex
account.signingKeyHex; // the account signing key
```

> Remember: You **must** keep your account signing key secret at all times. If someone has obtained your signing key, then your account is compromised along with all of its funds.

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

```js
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

### Validator

In this section we will be going over the base Validator node that both the Primary Validator and the Confirmation Validator inherit from. This will cover the basic usage of any Validator, but to learn more about where they deviate you can refer to their respective sections.  

### Creating Validators

To create a Validator we must pass in the url of the Validator you wish to interact with, into a constructor.

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
Now we know how to create a Validator and access it's configurations in our code, we can move on to the methods that work with the accounts that use it's services and the other nodes which are on it's network.

### Working With Accounts

To see all the acounts on the network your Validator is connected to, there is a `getAccounts` method. This method will return the total amount of accounts in the `count` property, and you can access more or past `results` with the URL links that the `next` and `previous` properties provide.  

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
const balance = await primaryValidator.getAccountBalance("57c10f3554872103c9b91e481347c2522dd5a13757831a51b12180c09e2e50ce");
console.log(balance);
// { balance: 2000 }

// call to getAccountBalanceLock
const balLock = await confirmationValidator.getAccountBalanceLock("57c10f3554872103c9b91e481347c2522dd5a13757831a51b12180c09e2e50ce");
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

Any validators main purpose is to validate the transactions that a Bank creates, these transactions are called Blocks.  All Validators share the `getValidConfirmationBlock` and `getQueuedConfirmationBlock` methods to view the Blocks that a Bank using their services are asking/asked them to validate. If you got to Your TNB Account Manager, click on a Validator and then its "confirmations", you will see a list of all the confirmed blocks that Validator proccessed and if you take the "Block Identifier" and pass it as a string to the `getValidConfirmationBlock` method, you will see the in depth details of a Block.

```ts

const PV = new PrimaryValidator("http://157.230.75.212");
const valConfBlock = await PV.getValidConfirmationBlock("b30231d7b4b3a00222d96340d3e89bb969f0476836402386f8ac334ac456b4ac");
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

To get an unconfirmed or queued Block is a little more difficult since the network is very fast, what we would have to do to get that information is have a bank to make a transaction, send it as a Block and then immediately grab the "Block ID" and pass it into the `getQueuedConfirmationBlocks` of a Validator that's services are being used by the bank.  Making bank transactions and sending them as blocks is a little out of the scope of this section, but all together it may look like this.

```ts
// let's assume this Confirmation Validator has it's services subscribed to by this Bank.
const CV = new ConfirmationValidator("http://157.230.10.237");
const bank = new tnb.Bank("http://143.110.137.54");
const transactionsData = await bank.getTransactions();
const transactions = transactionsData.results.map(({ amount, recipient }) => ({
  // Destructuring
  amount,
  recipient,
}));

await bank.addBlocks(
  "fakeBalanceLock",
  transactions,
  new tnb.Account("fakeSigningKey", "fakeAccountNumber")
);
/* the above code is explained in the Banks section, and for the sake not being repitive, 
please refer to the "Adding Blocks" subsection of Banks for a explination of this code*/

// get the last Block ID
const amountOfBlocks = await bank.getConfirmationBlocks().count;
const lastBlockID = await bank.getConfirmationBlocks({limit=1, offest=amountOfBlocks}).results[0].block_identifier;

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
This basically puts out the same information as `getVaildConfirmationBlocks` but the difference is that this "queued" block will be deemed valid or invalid soon.  The window to see it is very small because of the speed of the network, but if you grab the `block_identifier` of a newly created block you can keep track of it as it hits all the Validators that will be processing it.