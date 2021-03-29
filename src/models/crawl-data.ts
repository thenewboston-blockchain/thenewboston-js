/** The model for crawl status. */
export type CrawlCommand = "start" | "stop";

/** The model for crawl data. */
export interface CrawlData {
  crawl: CrawlCommand;
}
