const tnb = require("../");

describe("PaymentHandler", () => {
  const bank = new tnb.Bank("http://13.57.215.62");
  const pv = new tnb.PrimaryValidator("http://54.241.124.162/");
  const paymentHandler = new tnb.PaymentHandler({ bankUrl: bank.url });

  function assertPaymentHandlerBasics(paymentHandler) {
    expect(paymentHandler.bank.url).toBe(bank.url);
    expect(paymentHandler.primaryValidator.url).toBe(pv.url);
  }

  it("constructor()", async () => {
    await paymentHandler.init();
    assertPaymentHandlerBasics(paymentHandler);
  });

  it("sender: Account, txs: Transaction[]", async () => {
    paymentHandler.init();
    const sender = new tnb.Account();
    const recipient = new tnb.Account();

    const txs = [
      {
        amount: 100,
        recipient: recipient.accountNumberHex,
      },
    ];

    const transaction = await paymentHandler.createTransaction(sender, txs);
    expect(transaction.sender).toBe(sender);
    expect(transaction.balanceLock).toBe((await pv.getAccountBalanceLock(sender.accountNumberHex)).balance_lock);
    expect(transaction.transactions[0]).toStrictEqual(txs[0]);
  });
});
