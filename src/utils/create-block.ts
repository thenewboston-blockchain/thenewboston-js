import { Transaction } from "../models/transaction";
import { orderBy } from "lodash";
import { createSignature } from "./create-signature";

/**
 * Creates a block.
 * @param balanceLock the current balance lock
 * @param publicKeyHex
 * @param signingKey
 * @param transactions
 */
export function createBlock(
  balanceLock: string,
  publicKeyHex: string,
  signingKey: Uint8Array,
  transactions: Transaction[]
) {
  const message = {
    balance_key: balanceLock,
    txs: orderBy(transactions, ["recipient"]),
  };
  const strMessage = JSON.stringify(message);
  const block = {
    account_number: publicKeyHex,
    message,
    signature: createSignature(strMessage, signingKey),
  };
  return JSON.stringify(block);
}
