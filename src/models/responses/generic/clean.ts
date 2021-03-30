import type { Origin, Port, Protocol } from "../constants";

/** The response model for a crawl request. */
export interface CleanResponse {
  clean_last_completed: string;
  clean_status: string;
  ip_address: Origin;
  port: Port;
  protocol: Protocol;
}
