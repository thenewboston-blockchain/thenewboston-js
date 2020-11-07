const axios = require("axios");
const { formatUrl, formatDefaultOptions } = require("../utils");

class ServerNode {
  constructor(url, options = {}) {
    this.url = formatUrl(url);
    this.options = formatDefaultOptions(options);
  }

  /**
   * Gets data for the given endpoint with the given query params.
   * @param {string} endpoint
   * @param {object} params
   */
  async getData(endpoint, params = {}) {
    const res = await axios.get(`${this.url}${endpoint}`, {
      params,
    });
    return res.data;
  }

  /**
   * Used internally for handling paginated requests.
   * @param {string} endpoint The endpoint to send the request to.
   * @param {{ limit: number; offset: number; }} options The optional object for the pagination options. It can have a `limit` or `offset` key/value pair.
   */
  async getPaginatedData(endpoint, options) {
    const { limit, offset } = this.options.defaultPagination;
    return await this.getData(endpoint, {
      limit,
      offset,
      ...options,
    });
  }
}

module.exports = ServerNode;
