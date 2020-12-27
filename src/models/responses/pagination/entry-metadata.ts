import type { PaginatedEntry } from "./entry";

export interface PaginatedEntryMetadata extends PaginatedEntry {
  created_date: string;
  modified_date: string;
}
