import { BlockMessage } from "../../block-message";

export interface UpdatedBalance {
  account_number: string;
  balance: number;
  balance_lock?: string;
}

export interface ConfirmationBlock {
  message: {
    block: BlockMessage;
    block_identifier: string;
    updated_balances: UpdatedBalance[];
  };
  node_identifier: string;
  signature: string;
}
