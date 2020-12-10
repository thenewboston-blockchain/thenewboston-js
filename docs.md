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
