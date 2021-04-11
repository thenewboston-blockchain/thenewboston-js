/** The model for thenewboston transactions. */
export interface Transaction {
  amount: number;
  fee?: string;
  memo?: string;
  recipient: string;
}
