import type { Port, Protocol, Version } from "../../constants";

export interface PaginatedBankEntry {
  account_number: string;
  ip_address: string;
  node_identifier: string;
  port: Port | null;
  protocol: Protocol;
  version: Version;
  default_transaction_fee: number;
  confirmation_expiration: null;
  trust: string;
}
