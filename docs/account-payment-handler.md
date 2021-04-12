# Account Payment Handler

In this section, we will look at the methods of the `AccountPaymentHandler` class, which allows a client to make transactions using a specific bank.

## Sending Coins

Any application or user send coins by using a bank to process an account's transactions.

> **Note**: Before you can send coins you need to call the `init()` method in order to update to retrieve the details and transactions fees for the **Bank** and **Primary Validator**

Coins can be sent by using the `sendCoins()` method.

```ts
const sendersAccount = new Account("fakeSigningKey");
const bankUrl = "http://18.218.193.164";

const paymentHandlerOptions = {
  account: sendersAccount,
  bankUrl: bankUrl,
};

const paymentHandler = new tnb.AccountPaymentHandler(paymentHandlerOptions);

// This is very important.
// Method for getting the Bank and Primary validator Transactions fees
await paymentHandler.init();

//This can be a new Account object or just the recipients account number
const recipientAccount = new Account("fakeSigningKey");
const amount = 1000;

// You can use this method to send memos as well
await sendCoins(recipientAccount, amount, "memo");
```

## Send Bulk Payments

Any application or user can send multiple coins to multiple recipients from a single account.

> **Note**: Before you can send coins you need to call the `init()` method in order to update to retrieve the details and transactions fees for the **Bank** and **Primary Validator**

Bulk payments can be sent by using the `sendBulkPayments()` method.

```ts
const sendersAccount = new Account("fakeSigningKey");
const bankUrl = "http://18.218.193.164";

const paymentHandlerOptions = {
  account: sendersAccount,
  bankUrl: bankUrl,
};

const paymentHandler = new tnb.AccountPaymentHandler(paymentHandlerOptions);

// This is very important.
// Method for getting the Bank and Primary validator Transactions fees
await paymentHandler.init();

/* Note
    The sender cannot be listed as a recipient
    A recipient cannot be listed more than once
    You must follow this order of the fields
*/

const txs = [
  {
    amount: 10,
    recipient: "fakeAccountNumber1",
  },
  {
    amount: 100,
    memo: "hi",
    recipient: "fakeAccountNumber2",
  },
  {
    amount: 1000,
    recipient: "fakeAccountNumber3",
  },
];

await sendBulkPayments(txs);
```
