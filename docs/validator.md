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
