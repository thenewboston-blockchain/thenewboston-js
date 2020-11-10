import type { Account } from "../models";
import { sign } from "tweetnacl";

/**
 * Generates an account with a 32-bit account number and signing key.
 * @returns the generated account
 */
export function createAccount(): Account {
  const keyPair = sign.keyPair();
  const { publicKey, secretKey: signingKey } = keyPair;
  const publicKeyHex = Buffer.from(publicKey).toString("hex");
  const signingKeyHex = Buffer.from(signingKey).toString("hex");
  return {
    publicKey,
    publicKeyHex,
    signingKey,
    signingKeyHex: signingKeyHex.replace(publicKeyHex, ""),
  };
}
