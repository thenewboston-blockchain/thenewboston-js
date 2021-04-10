import axios from "axios";
import { formatUrl, formatDefaultOptions } from "./utils";
import type {
  PaginatedAccountEntry,
  PaginatedEntryMetadata,
  PaginatedResponse,
  PaginationOptions,
  ServerNodeOptions,
} from "./models";
import type { Account } from "./account";
import type { Protocol } from "./models/responses/constants";
import { throwError } from "./utils";

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
    return await this.getData<PaginatedResponse<T>>(endpoint, {
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
    const res = await axios.post<T>(`${this.url}${endpoint}`, data).catch((err) => {
      console.log(err.response.data);
      throwError("Failed to postData:", err);
    });
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

  /**
   * Gets the accounts for the given server node in a paginated format.
   * @param options The optional object for the pagination options.
   */
  async getAccounts(options: Partial<PaginationOptions> = {}) {
    return await this.getPaginatedData<PaginatedAccountEntry & PaginatedEntryMetadata>("/accounts", options);
  }

  /** Gets the current config data for the current validator. */
  protected async _getConfig<T>() {
    return await this.getData<T>("/config");
  }

  /**
   * Sends a connection request to this current network with the data about the new server.
   * @param ipAddress the new server node's ip address
   * @param port the new node's port
   * @param protocol the new node's protocol
   * @param account the server account to validate the request
   */
  async sendConnectionRequest(ipAddress: string, port: number, protocol: Protocol, account: Account) {
    return await this.postData(
      "/connection_requests",
      account.createSignedMessage({
        ip_address: ipAddress,
        port,
        protocol,
      })
    );
  }
}
