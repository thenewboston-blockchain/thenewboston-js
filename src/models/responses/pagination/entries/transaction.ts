import type { PaginatedBlockEntry } from "./block";
import type { PaginatedEntryMetadata } from "../entry-metadata";

export interface PaginatedTransactionEntry {
  block: PaginatedBlockEntry & PaginatedEntryMetadata;
  amount: number;
  recipient: string;
}
