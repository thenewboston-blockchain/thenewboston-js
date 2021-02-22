import type { Account } from "../account";

export class TransferDetails {
  public sender: Account;
  public recipient: Account | string;
  public amount: number;

  constructor(sender: Account, recipient: Account | string, amount: number) {
    this.sender = sender;
    this.recipient = recipient;
    this.amount = amount;
  }
}
