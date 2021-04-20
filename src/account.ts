import { createAccountData, uint8arrayToHex, hexToUint8Array } from "./utils";
import type { BlockData, BlockMessage, SignedMessage, Transaction } from "./models";
import { sign } from "tweetnacl";

type AccountKeys = [Uint8Array, Uint8Array];

/** Used for creating accounts to be sent with requests. */
export class Account {
  /** The 32 byte array for the account number. */
  public accountNumber: Uint8Array;
  /** The 64 byte array for the account signing key. */
  public signingKey: Uint8Array;

  /**
   * @param signingKey the account signing key
   * @param accountNumber the account number
   */
  constructor(signingKey?: string, accountNumber?: string) {
    let accountKeys: AccountKeys;
    if (accountNumber && signingKey) {
      accountKeys = Account.fromBothKeys(signingKey, accountNumber);
    } else if (signingKey) {
      accountKeys = Account.fromSigningKey(signingKey);
    } else {
      accountKeys = Account.random();
    }
    this.accountNumber = accountKeys[0];
    this.signingKey = accountKeys[1];
  }

  static fromSigningKey(signingKey: string): AccountKeys {
    const { publicKey: accountNumber, secretKey: signingKey_ } = sign.keyPair.fromSeed(hexToUint8Array(signingKey));
    return [accountNumber, signingKey_];
  }

  static fromBothKeys(signingKey: string, accountNumber: string): AccountKeys {
    const accountNumberArray = hexToUint8Array(accountNumber);
    const signingKeyArray = new Uint8Array(64);
    signingKeyArray.set(hexToUint8Array(signingKey));
    signingKeyArray.set(accountNumberArray, 32);
    return [accountNumberArray, signingKeyArray];
  }

  static random(): AccountKeys {
    const { publicKey: accountNumber, signingKey } = createAccountData();
    return [accountNumber, signingKey];
  }

  /**
   * Checks if the signing key pair is valid.
   * @param signingKey the given signing key hex string
   * @param accountNumber the given account number hex string
   */
  static isValidPair(signingKey: string, accountNumber: string) {
    try {
      return new Account(signingKey).accountNumberHex === accountNumber;
    } catch (_) {
      return false;
    }
  }

  /** The 32 byte account number as a 32 byte hex string. */
  get accountNumberHex() {
    return uint8arrayToHex(this.accountNumber);
  }

  /** The 64 byte account signing key as a 32 byte hex string. */
  get signingKeyHex() {
    return uint8arrayToHex(this.signingKey).slice(0, 64);
  }

  /**
   * Creates a signature for the given message.
   * @param message the message to generate the signature for
   * @returns the generated signature
   */
  createSignature(message: string) {
    const encodedData = new TextEncoder().encode(message);
    const signatureArray = sign(encodedData, this.signingKey);
    const signature = uint8arrayToHex(signatureArray);
    return signature.substring(0, 128);
  }

  /**
   * Creates a signed data message with the given data.
   * @param data the data to be passed along in the message
   * @returns the signed message
   */
  createSignedMessage<T>(data: T): SignedMessage<T> {
    return {
      message: data,
      node_identifier: this.accountNumberHex,
      signature: this.createSignature(JSON.stringify(data)),
    };
  }

  /**
   * Creates a block data object without a signature.
   * @param balanceLock the latest user balance lock
   * @param transactions the transactions inside of the block
   */
  createBlockData(balanceLock: string, transactions: Transaction[]): BlockData {
    const message = {
      balance_key: balanceLock,
      txs: transactions.sort((tx1, tx2) => tx1.recipient.localeCompare(tx2.recipient)),
    };
    return {
      account_number: this.accountNumberHex,
      message,
    };
  }

  /**
   * Creates a signed block object.
   * @param balanceLock the latest user balance lock
   * @param transactions the transactions inside of the block
   */
  createBlockMessage(balanceLock: string, transactions: Transaction[]): BlockMessage {
    const blockData = this.createBlockData(balanceLock, transactions);
    return {
      ...blockData,
      signature: this.createSignature(JSON.stringify(blockData.message)),
    };
  }
}
