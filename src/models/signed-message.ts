/** The interface for the signed message that can send data to the server nodes. */

export interface SignedMessage<T> {
  message: T;
  node_identifier: string;
  signature: string;
}
