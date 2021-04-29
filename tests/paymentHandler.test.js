const tnb = require("../dist");

describe("PaymentHandler", () => {
  const bank = new tnb.Bank("http://54.177.121.3");
  const paymentHandler = new tnb.PaymentHandler({ bankUrl: bank.url });

  it("constructor()", async () => {
    await paymentHandler.init();
    const pv = await bank.getBankPV();
    expect(paymentHandler.bank.url).toBe(bank.url);
    expect(paymentHandler.primaryValidator.url).toBe(pv.url);
  });

  it("createTransaction(sender: Account, txs: Transaction[])", async () => {
    const pv = await bank.getBankPV();
    paymentHandler.init();
    const sender = new tnb.Account();
    const recipient = new tnb.Account();

    const txs = [
      {
        amount: 100,
        memo: "hi",
        recipient: recipient.accountNumberHex,
      },
    ];

    const transaction = await paymentHandler.createTransaction(sender, txs);
    expect(transaction.sender).toBe(sender);
    expect(transaction.balanceLock).toBe((await pv.getAccountBalanceLock(sender.accountNumberHex)).balance_lock);
    expect(transaction.transactions[0].amount).toBe(100);
    expect(transaction.transactions[0].memo).toBe("hi");
  });
});
