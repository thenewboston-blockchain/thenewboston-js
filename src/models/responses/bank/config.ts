import type { Hex, Origin, Port, Protocol, Url, Trust, Version, NodeType } from "../constants";

export interface BankConfigResponse {
  primary_validator: {
    account_number: Hex;
    ip_address: Origin;
    node_identifier: Hex;
    port: Port | null;
    protocol: Protocol;
    version: Version;
    default_transaction_fee: number;
    root_account_file: Url;
    root_account_file_hash: Hex;
    seed_block_identifier: Hex;
    daily_confirmation_rate: number | null;
    trust: Trust;
  };
  account_number: Hex;
  ip_address: Origin;
  node_identifier: Hex;
  port: Port | null;
  protocol: Protocol;
  version: Version;
  default_transaction_fee: number;
  node_type: NodeType.bank;
}
