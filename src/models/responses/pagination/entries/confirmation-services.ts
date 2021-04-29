import { PaginatedEntry } from "../";

export interface ConfirmationServices extends PaginatedEntry {
  end: string;
  start: string;
  bank: string;
  validator: string;
}

export type BankConfirmationServices = Omit<ConfirmationServices, "validator">;
export type ValidatorConfirmationServices = Omit<ConfirmationServices, "bank">;
