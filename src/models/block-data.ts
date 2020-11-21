import type { Transaction } from "./transaction";

/** The interface for the data that will be included within requests for transactions. */
export interface BlockData {
  account_number: string;
  message: {
    balance_key: string;
    txs: Transaction[];
  };
}
