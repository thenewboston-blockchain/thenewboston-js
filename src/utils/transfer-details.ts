import type { Account } from "../account";
import { throwError } from "./throw-error";

export class TransferDetails {
  public sender: Account;
  public recipient: Account | string;
  public amount: number;
  public memo: string;

  constructor(sender: Account, recipient: Account | string, amount: number, memo: string) {
    this.sender = sender;
    this.recipient = recipient;
    this.amount = amount;
    this.memo = memo;
  }
}
