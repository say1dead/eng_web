export function renderFilters(state, elements, taxonomy, ui, onFilterChange) {
  renderSegment(elements.countries, [
    { code: "", name: ui.all },
    ...taxonomy.countries.map(country => ({ code: String(country.code), name: country.name }))
  ], "country", state, onFilterChange);

  renderSegment(elements.categories, [
    { code: "", name: ui.all },
    ...taxonomy.categories
  ], "category", state, onFilterChange);
}

function renderSegment(container, options, stateKey, state, onFilterChange) {
  container.replaceChildren();

  for (const option of options) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option.name;
    button.classList.toggle("active", state[stateKey] === option.code);
    button.addEventListener("click", () => {
      state[stateKey] = option.code;
      if (stateKey === "country") {
        state.category = "";
      }
      onFilterChange();
    });
    container.append(button);
  }
}
