/** The interface for accounts that is mainly used internally for creating `Account` classes from existing data. */
export interface AccountData {
  publicKey: Uint8Array;
  signingKey: Uint8Array;
  publicKeyHex: string;
  signingKeyHex: string;
}
