/** The model for crawl status. */
export type CleanCommand = "start" | "stop";

/** The model for crawl data. */
export interface CleanData {
  clean: CleanCommand;
}
