import { specLabelsByLanguage, taxonomyByLanguage } from "../data/localization.js?v=encoding-20260428";
import { assetUrl } from "../utils/assets.js";

export function normalizeItem(raw, language) {
  const id = String(raw.id);
  const countryCode = Number(id.slice(0, 1));
  const categoryCode = id.slice(1, 2);
  const taxonomy = taxonomyByLanguage[language];
  const category = taxonomy.categories.find(item => item.code === categoryCode) || {
    code: categoryCode,
    name: `Category ${categoryCode}`,
    kind: "weapon"
  };
  const country = taxonomy.countries.find(item => item.code === countryCode)?.name || `Country ${countryCode}`;
  const specs = {};
  const specLabels = specLabelsByLanguage[language];

  for (const [key, value] of Object.entries(raw)) {
    if (["id", "name", "country", "description"].includes(key) || !value) {
      continue;
    }
    specs[specLabels[key] || key] = String(value);
  }

  return {
    id,
    name: String(raw.name || id),
    country,
    countryCode,
    categoryCode,
    category: category.name,
    position: Number(id.slice(2)) || 0,
    kind: category.kind,
    imageUrl: assetUrl(`images/${id}.jpg`),
    specs,
    description: String(raw.description || "")
  };
}

export function formatMeta(item, ui) {
  return `${item.country} | ${item.category} | ${getAdoptionYear(item, ui)}`;
}

export function getAdoptionYear(item, ui) {
  const yearLabels = [
    specLabelsByLanguage.en.year,
    specLabelsByLanguage.ru.year
  ];

  for (const label of yearLabels) {
    const yearText = item.specs?.[label] || "";
    const match = yearText.match(/\b(18|19|20)\d{2}\b/);
    if (match) {
      return match[0];
    }
  }

  return ui.yearUnknown;
}

export function getAdoptionYearNumber(item, ui) {
  const year = Number(getAdoptionYear(item, ui));
  return Number.isFinite(year) ? year : 0;
}

export function getDecade(item, ui) {
  const year = getAdoptionYearNumber(item, ui);
  if (year < 1900) {
    return 1900;
  }
  if (year >= 2000) {
    return 1990;
  }
  return Math.floor(year / 10) * 10;
}
