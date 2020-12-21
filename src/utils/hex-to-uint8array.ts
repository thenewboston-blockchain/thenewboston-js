export function hexToUint8Array(arr: string): Uint8Array {
  return new Uint8Array(Buffer.from(arr, "hex"));
}
