import type { Origin, Port, Protocol } from "../constants";

export enum CleanStatus {
  cleaning = "cleaning",
  notCleaning = "not_cleaning",
  stopRequested = "stop_requested",
}

/** The response model for a crawl request. */
export interface CleanResponse {
  clean_last_completed: string;
  clean_status: CleanStatus | null;
  ip_address: Origin;
  port: Port;
  protocol: Protocol;
}
