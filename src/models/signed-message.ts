import type { SignedData } from "./signed-data";

/** The interface for user authenticated messages. */
export interface SignedMessage<T> extends SignedData<T> {
  node_identifier: string;
}
