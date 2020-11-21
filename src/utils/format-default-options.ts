import type { ServerNodeOptions } from "../models";

/**
 * Formats the options for server nodes.
 * @param options the object for the server node options
 */
export function formatDefaultOptions(options: { [key: string]: any }): ServerNodeOptions {
  /*
      Default Options should look like:
      {
        defaultPagination: {
          limit: 20,
          offset: 0
        }
      }
      but also allow re-writes to the `defaultPagination` key while having all keys.
    */
  return {
    ...options,
    defaultPagination: {
      limit: 20,
      offset: 0,
      ...(options.defaultPagination || {}),
    },
  };
}
