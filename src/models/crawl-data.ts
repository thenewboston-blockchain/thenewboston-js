/** The model for crawl status. */
export type CrawlStatus = "start" | "stop";

/** The model for crawl data. */
export interface CrawlData {
  crawl: CrawlStatus;
}
