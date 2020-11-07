function formatDefaultOptions(options) {
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

module.exports = formatDefaultOptions;
