import { createSearchIndex, normalizeSearchText } from "./search-normalizer.js";

export function filterItems(items, state) {
  const search = normalizeSearchText(state.query);

  return items.filter(item => {
    const countryMatches = !state.country || String(item.countryCode) === state.country;
    const categoryMatches = !state.category || item.categoryCode === state.category;
    const searchMatches = !search || getSearchIndex(item).includes(search);

    return countryMatches && categoryMatches && searchMatches;
  });
}

function getSearchIndex(item) {
  item.searchIndex ??= createSearchIndex([
    item.id,
    item.name,
    item.country,
    item.category,
    item.description,
    ...Object.values(item.specs || {})
  ]);
  return item.searchIndex;
}
