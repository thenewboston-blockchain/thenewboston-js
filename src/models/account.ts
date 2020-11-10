export interface Account {
  publicKey: Uint8Array;
  signingKey: Uint8Array;
  publicKeyHex: string;
  signingKeyHex: string;
}
