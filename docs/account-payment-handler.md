# Account Payment Handler

In this section, we will look at the methods of the `AccountPaymentHandler` class, which allows a client to make transactions using a specific bank.

## Sending Coins

Any Application can send coins by using a bank to process an account's transactions.

>**Note**: Before you can send coins you need to call the `init()` method in order to update to retrieve the details and transactions fees for the **Bank** and **Primary Validator**

We send coins using the `sendCoins()` method.

```ts

const sendersAccount = new Account("fakeSigningKey");
const bankUrl = "http://18.218.193.164";

const paymentHandlerOptions={
    account: sendersAccount,
    bankUrl: bankUrl
}

const paymentHandler = new tnb.AccountPaymentHandler(paymentHandlerOptions);

// This is very important. 
// Method for getting the Bank and Primary validator Transactions fees
await paymentHandler.init();

//This can be a new Account object or just the recipients account number
const recipientAccount = new Account ("fakeSigningKey");
const amount = 1000;

await sendCoins(recipientAccount, 1000);

```