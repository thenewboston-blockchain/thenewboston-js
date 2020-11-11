export function uint8arrayToHex(array: Uint8Array): string {
  return Buffer.from(array).toString("hex");
}
