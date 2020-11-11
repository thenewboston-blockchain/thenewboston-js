/**
 * Normalizes a url for requests to be made with.
 * @param url the url string that must include the protocol (https, http, ect.) of the requests
 */
export function formatUrl(url: string) {
  return new URL(url).origin;
}
