/** The interface for the signed data that can be sent via messages to the server nodes. */
export interface SignedData<T> {
  data: T;
  signature: string;
}
