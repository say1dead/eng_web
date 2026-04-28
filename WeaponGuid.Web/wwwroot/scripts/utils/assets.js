const assetBaseUrl = new URL("../../", import.meta.url);

export function assetUrl(path) {
  return new URL(path, assetBaseUrl).toString();
}
