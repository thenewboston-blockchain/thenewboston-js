export function uint8arrayToHex(uint8array: Uint8Array) {
  return Buffer.from(uint8array).toString("hex");
}
