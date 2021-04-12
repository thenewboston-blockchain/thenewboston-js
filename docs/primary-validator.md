# Primary Validator

In this section, we will look at the methods of the `Primary Validator` class, which extends the `Validator` class.

> It is recommended that you read the [documentation for the `Validator` Class](#Validator) first, to understand the base methods before reading this section.

## Adding Bank Blocks

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
    memo: "hi",
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

## Getting the Primary Validator's Transaction Fee

Simply use the `PrimaryValidator.getTxFee` method to get the transaction fee

```ts
const primaryValidator = new tnb.PrimaryValidator("http://157.230.75.212");
console.log(await primaryValidator.getTxFee());
// 1
```
