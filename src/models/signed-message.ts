import type { SignedData } from "./signed-data";

export interface SignedMessage<T> extends SignedData<T> {
  node_identifier: string;
}
