import axios from "axios";
import { formatUrl, formatDefaultOptions } from "./utils";
import type { PaginationOptions, ServerNodeOptions } from "./models";

/**
 * Used internally for all server nodes.
 *
 * Note: this class is meant to be extended.
 */
export abstract class ServerNode {
  /** The url of the server. */
  public url: string;
  /** The options for the server node. */
  public options: ServerNodeOptions;

  constructor(url: string, options: Partial<ServerNodeOptions> = {}) {
    this.url = formatUrl(url);
    this.options = formatDefaultOptions(options);
  }

  /**
   * Gets data for the given endpoint with the given query params.
   * @param endpoint the endpoint to send the request to
   * @param params the optional object for the query params
   */
  async getData<T>(endpoint: string, params: { [key: string]: any; [key: number]: any } = {}) {
    const res = await axios.get<T>(`${this.url}${endpoint}`, {
      params,
    });
    return res.data;
  }

  /**
   * Used internally for handling paginated requests.
   * @param endpoint the endpoint to send the request to
   * @param options the optional object for the pagination options
   */
  async getPaginatedData<T>(endpoint: string, options: Partial<PaginationOptions>) {
    return await this.getData<T>(endpoint, {
      ...this.options.defaultPagination,
      ...options,
    });
  }

  /**
   * Sends a POST request to the current server with the given `data`.
   * @param endpoint the endpoint to send the request to
   * @param data what is sent along with the POST request
   */
  async postData<T>(endpoint: string, data: any) {
    const res = await axios.post<T>(`${this.url}${endpoint}`, data);
    return res.data;
  }

  /**
   * Sends a PATCH request to the current server with the given `data`.
   * @param endpoint the endpoint to send the request to
   * @param data what is sent along with the PATCH request
   */
  async patchData<T>(endpoint: string, data: any) {
    const res = await axios.patch<T>(`${this.url}${endpoint}`, data);
    return res.data;
  }
}
