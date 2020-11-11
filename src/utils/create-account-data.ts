import type { AccountData } from "../models";
import { sign } from "tweetnacl";
import { uint8arrayToHex } from "./uint8array-to-hex";

/**
 * Generates an account with a 32-bit account number and signing key.
 * @returns the generated account
 */
export function createAccountData(): AccountData {
  const keyPair = sign.keyPair();
  const { publicKey, secretKey: signingKey } = keyPair;
  const publicKeyHex = uint8arrayToHex(publicKey);
  const signingKeyHex = uint8arrayToHex(signingKey);
  return {
    publicKey,
    publicKeyHex,
    signingKey,
    signingKeyHex: signingKeyHex.replace(publicKeyHex, ""),
  };
}
