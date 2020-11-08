export function formatUrl(url: string) {
  return new URL(url).origin;
}
