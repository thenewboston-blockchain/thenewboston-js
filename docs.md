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

In this section we are going to talk about the base Validator node that both the Primary Validator and the Confirmation Validator inherit from. We will be going over the basic usage of any Validator, which is to validate transactions, but to learn more about where they deviate you can refer to their respective sections.  For now in this section, and for the sake of shorthand we will refer to both types as just "Validators", but with code examples for each.

### Creating Validators

To create a Validator we must pass in the url of the Validator you wish to interact with, into a constructor.

```ts
// create object with access to the API and basic functions of a Validator.
const confirmationValidator = new ConfirmationValidator("http://157.230.10.237");
const primaryValidator = new PrimaryValidator("http://157.230.75.212");

// Get the current config data for validators, must be in asynchronous function.
async function getValidatorConfigs() {
  let configs = {
    primary: await primaryValidator.getConfig(),
    confirmation: await confirmationValidator.getConfig(),
  } 
  return configs
}
```
If you log that asynchronous function to the console, you should see something like this.

```js
{
  primary: {
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
  },
  confirmation: {
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
}
```