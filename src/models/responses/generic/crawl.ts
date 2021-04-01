import type { Origin, Port, Protocol } from "../constants";

/** The response model for a crawl request. */
export interface CrawlResponse {
  crawl_last_completed: string;
  crawl_status: string;
  ip_address: Origin;
  port: Port;
  protocol: Protocol;
}
