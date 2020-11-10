import { sign } from "tweetnacl";

export function createSignature(message: string, signingKey: Uint8Array) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(message);
  const signatureArray = sign(encodedData, signingKey);
  const signature = Buffer.from(signatureArray).toString("hex");
  return signature.substring(0, 128);
}
