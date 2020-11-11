import { createSignature } from "./create-signature";

export function createSignedMessage(message: any, publicKeyHex: string, signingKey: Uint8Array) {
  const strMessage = JSON.stringify(message);
  const signedMessage = {
    message,
    node_identifier: publicKeyHex,
    signature: createSignature(strMessage, signingKey),
  };
  return JSON.stringify(signedMessage);
}
