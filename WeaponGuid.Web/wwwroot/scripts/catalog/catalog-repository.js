import { fetchJson } from "../core/http.js";
import { normalizeItem } from "./catalog-model.js";
import { assetUrl } from "../utils/assets.js";

export async function ensureCatalogLoaded(state, language) {
  if (state.catalogs[language]) {
    return state.catalogs[language];
  }

  const [weapons, vehicles, aircraft] = await Promise.all([
    fetchJson(assetUrl(`data/${language}/weapons.json`)),
    fetchJson(assetUrl(`data/${language}/wheel_auto.json`)),
    fetchJson(assetUrl(`data/${language}/fly_auto.json`))
  ]);

  const items = [...weapons, ...vehicles, ...aircraft]
    .map(raw => normalizeItem(raw, language))
    .sort((left, right) =>
      left.countryCode - right.countryCode ||
      left.categoryCode.localeCompare(right.categoryCode) ||
      left.position - right.position
    );

  state.catalogs[language] = items;
  return items;
}
