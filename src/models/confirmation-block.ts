import { BlockMessage } from "./block-message";

/**
 * The interface for a confirmation block message that will be sent with requests.
 *
 * Note: this also includes all of the properties of a `BlockMessage` object.
 */

export interface UpdatedBalance {
  account_number: string;
  balance: number;
  balance_lock?: string;
}

export interface ConfirmationBlock {
  block: BlockMessage;
  block_identifier: string;
  updated_balances: UpdatedBalance[];
}
