function formatUrl(url) {
  return new URL(url).origin;
}

module.exports = formatUrl;
