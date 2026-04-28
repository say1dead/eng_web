export function filterItems(items, state) {
  const search = state.query.trim().toLowerCase();

  return items.filter(item => {
    const countryMatches = !state.country || String(item.countryCode) === state.country;
    const categoryMatches = !state.category || item.categoryCode === state.category;
    const searchMatches = !search || [
      item.name,
      item.country,
      item.category,
      item.description,
      ...Object.values(item.specs || {})
    ].some(value => String(value).toLowerCase().includes(search));

    return countryMatches && categoryMatches && searchMatches;
  });
}
