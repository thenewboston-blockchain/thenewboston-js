# Documentation

Here, you will learn about how to use all of what thenewboston-js has to offer. If you notice an error or typo, then please create a pull request yourself and we can pull in the changes to save everyone some time.

## Getting Started

Currently, the only way to use the library is to clone the repository and download the files while loading them into your project. We will upload this the library to [npm](https://npmjs.com).

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

As you can tell, if you don't pass in anything into the `Accocunt` class, then it just generates a random account for you. Now, let's get a little more complex, you can passs in the `signingKey` as the first parameter within `Account` and it will set the `signingKeyHex` of the `Account` as it. Also, due to the fact that we are using the signing-based cryptographic algorithms, the `accountNumberHex` is able to be generated automatically. Here is an example of this behavior in action:

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

### Bank

In this section, we will discuss how to create banks and work with them.

#### Creating Banks

Creating banks is pretty straightforward, all we need to do is create an instance of the `Bank` class like this.

```js
// Instantiates a new bank
const bank = new Bank("https://localhost:3000");
```

The string which was passed in is the _url_ parameter. This is the url where your bank is located, it could be your ec2 instance address, the digital ocean droplet address, or wherever your bank is.

Now, we can see that we get the same url that we passed in.

```js
console.log(bank.url);
// `https://localhost:3000`
```

You probably know that there is another parameter that can be passed when creating a bank. This is optional.

Even if you don't pass in an options object, there will be a default one.

```js
console.log(bank.options);
// { defaultPagination: { limit: 20, offset: 0 } }
```

With the following, you can pass in your own object.

```js
const bank = new Bank("https://localhost:3000", { defaultPagination: { limit: 10, offset: 0 } });

console.log(bank.options);
// { defaultPagination: { limit: 10, offset: 0 } }
```

> The defaultPagination object is used as default options, when we make api calls later.

#### Getting Accounts

We can get the accounts which are linked to the bank with the `Bank.getAccounts` method.

```js
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

As you can see, this returns a bunch of accounts with some extra data like count, next, and previous.This is where the options object plays in.

Since we didn't specify the options object at all in this code, the default one - `{ defaultPagination: { limit: 20, offset: 0 } }` is used.

However, if we do pass in our own options object, we can customize the `offset` and `limit` for each api call.

```js
const bank = new Bank("http://143.110.137.54", { defaultPagination: { limit: 2, offset: 0 } });
bank.getAccounts();
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

As expected, we can also pass in the options object in the api call itself.

```js
bank.getAccounts({ limit: 10, offset: 30 });
```

> The options object passed into theapi call has higher precedence than the one passed into the bank constructor.

> The behaviour of the options object is similar with all the api calls.
