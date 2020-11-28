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
   * @param endpoint the endpoint to send the request to
   * @param params the optional object for the query params
   */
  async getData(endpoint: string, params: { [key: string]: any; [key: number]: any } = {}) {
    const res = await axios.get(`${this.url}${endpoint}`, {
      params,
    });
    return res.data;
  }

  /**
   * Used internally for handling paginated requests.
   * @param endpoint the endpoint to send the request to
   * @param options the optional object for the pagination options
   */
  async getPaginatedData(endpoint: string, options: Partial<PaginationOptions>) {
    const { limit, offset } = this.options.defaultPagination;
    return await this.getData(endpoint, {
      limit,
      offset,
      ...options,
    });
  }

  /**
   * Sends a POST request to the current server with the given `data`.
   * @param endpoint the endpoint to send the request to
   * @param data what is sent along with the POST request
   */
  async postData<T>(endpoint: string, data: T) {
    const res = await axios.post(`${this.url}${endpoint}`, data);
    return res.data;
  }
}
