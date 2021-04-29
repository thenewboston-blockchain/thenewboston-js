import type { Hex, Origin, Port, Protocol, Url, Version, NodeType } from "../constants";

export interface PrimaryValidatorConfigResponse {
  primary_validator: null;
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
  daily_confirmation_rate: number;
  node_type: NodeType.primaryValidator;
}
