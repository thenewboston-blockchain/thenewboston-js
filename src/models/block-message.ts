import type { BlockData } from "./block-data";

export interface BlockMessage extends BlockData {
  signature: string;
}
