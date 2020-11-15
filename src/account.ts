import { createAccountData, uint8arrayToHex } from "./utils";
import type { BlockData, BlockMessage, SignedData, SignedMessage, Transaction } from "./models";
import { sign } from "tweetnacl";

export class Account {
  /** The 32 byte array for the account number. */
  publicKey: Uint8Array;
  /** The 64 byte array for the account signing key. */
  signingKey: Uint8Array;

  /**
   * @param signingKey the account signing key
   * @param publicKey the account number
   */
  constructor(signingKey?: Uint8Array | string, publicKey?: Uint8Array | string) {
    if (signingKey) {
      // we have the signing key, so we are either going to find out the public key or use it if it is given
      if (typeof signingKey === "string" && typeof publicKey === "string") {
        this.publicKey = new Uint8Array(Buffer.from(signingKey, "hex"));
        this.signingKey = new Uint8Array(Buffer.from(publicKey, "hex"));
      } else if (typeof signingKey === "string") {
        // the signing key is a hex -> generate the key pair from the seed
        const keyPair = sign.keyPair.fromSeed(new Uint8Array(Buffer.from(signingKey, "hex")));
        this.publicKey = keyPair.publicKey;
        this.signingKey = keyPair.secretKey;
      } else {
        // the signing key is a uint 8 array
        this.publicKey = sign.keyPair.fromSecretKey(signingKey).publicKey;
        this.signingKey = signingKey;
      }
    } else {
      // they don't have anything (we need to make a random account)
      const { publicKey: _publicKey, signingKey: _signingKey } = createAccountData();
      this.publicKey = _publicKey;
      this.signingKey = _signingKey;
    }
  }

  /** The 32 byte account number as a 32 byte hex string. */
  get publicKeyHex() {
    return uint8arrayToHex(this.publicKey);
  }

  /** The 64 byte account signing key as a 32 byte hex string. */
  get signingKeyHex() {
    return uint8arrayToHex(this.signingKey).replace(this.publicKeyHex, "");
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
   * Creates a signed data object.
   * @param data the data to be used to generate the signature
   * @returns the signed data object
   */
  createSignedData<T>(data: T): SignedData<T> {
    return {
      data,
      signature: this.createSignature(JSON.stringify(data)),
    };
  }

  /**
   * Creates a signed data message with the given data.
   * @param data the data to be passed along in the message
   * @returns the signed message
   */
  createSignedMessage<T>(data: T): SignedMessage<T> {
    const { data: _data, signature } = this.createSignedData(data);
    return {
      data: _data,
      node_identifier: this.publicKeyHex,
      signature,
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
      account_number: this.publicKeyHex,
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
