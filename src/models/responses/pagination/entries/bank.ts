import type { Protocol, Version } from "../../constants";

export interface PaginatedBankEntry {
  account_number: string;
  ip_address: string;
  node_identifier: string;
  port: number | null;
  protocol: Protocol;
  version: Version;
  default_transaction_fee: number;
  confirmation_expiration: null;
  trust: string;
}
