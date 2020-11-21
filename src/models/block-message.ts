import type { BlockData } from "./block-data";

/**
 * The interface for a block message that will be sent with requests.
 *
 * Note: this also includes all of the properties of a `BlockData` object.
 */
export interface BlockMessage extends BlockData {
  signature: string;
}
