import axios from "axios";
import { formatUrl, formatDefaultOptions } from "./utils";
import type { PaginationOptions, ServerNodeOptions } from "./models";

/**
 * Used internally for all server nodes.
 *
 * Note: this class is meant to be extended.
 */
export class ServerNode {
  url: string;
  options: ServerNodeOptions;

  constructor(url: string, options: Partial<ServerNodeOptions> = {}) {
    this.url = formatUrl(url);
    this.options = formatDefaultOptions(options);
  }

  /**
   * Gets data for the given endpoint with the given query params.
   * @param endpoint
   * @param params
   */
  async getData(endpoint: string, params: { [key: string]: any; [key: number]: any } = {}) {
    const res = await axios.get(`${this.url}${endpoint}`, {
      params,
    });
    return res.data;
  }

  /**
   * Used internally for handling paginated requests.
   * @param endpoint The endpoint to send the request to.
   * @param options The optional object for the pagination options. It can have a `limit` or `offset` key/value pair.
   */
  async getPaginatedData(endpoint: string, options: Partial<PaginationOptions>) {
    const { limit, offset } = this.options.defaultPagination;
    return await this.getData(endpoint, {
      limit,
      offset,
      ...options,
    });
  }
}
