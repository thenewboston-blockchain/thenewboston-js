import type { Origin, Port, Protocol } from "../constants";

export enum CrawlStatus {
  crawling = "crawling",
  notCrawling = "not_crawling",
  stopRequested = "stop_requested",
}

/** The response model for a crawl request. */
export interface CrawlResponse {
  crawl_last_completed: string;
  crawl_status: CrawlStatus | null;
  ip_address: Origin;
  port: Port;
  protocol: Protocol;
}
