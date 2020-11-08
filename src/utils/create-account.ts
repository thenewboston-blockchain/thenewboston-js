import type { Account } from "../models";
import { box } from "tweetnacl";
import { uint8arrayToHex } from "./uint8array-to-hex";

/**
 * Generates an account with a 32-bit account number and a 64-bit signing key.
 * @returns the generated account
 */
export function createAccount(): Account {
  const { publicKey, secretKey } = box.keyPair();
  return {
    accountNumber: uint8arrayToHex(publicKey),
    signingKey: uint8arrayToHex(secretKey),
  };
}
