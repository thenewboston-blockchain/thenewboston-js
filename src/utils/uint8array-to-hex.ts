/** Converts a Uint8Array to a hexadecimal string. */
export function uint8arrayToHex(array: Uint8Array): string {
  return Buffer.from(array).toString("hex");
}
