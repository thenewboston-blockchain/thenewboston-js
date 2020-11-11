import type { Transaction } from "./transaction";

export interface BlockData {
  account_number: string;
  message: {
    balance_key: string;
    txs: Transaction[];
  };
}
