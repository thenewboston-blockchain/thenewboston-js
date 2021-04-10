import type { Port, Protocol, Version } from "../../constants";

export interface PaginatedValidatorEntry {
  account_number: string;
  ip_address: string;
  node_identifier: string;
  port: Port | null;
  protocol: Protocol;
  version: Version;
  default_transaction_fee: number;
  root_account_file: string;
  root_account_file_hash: string;
  seed_block_identifier: string;
  daily_confirmation_rate: Port | null;
  trust: string;
}
