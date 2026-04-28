import { filterItems } from "./catalog/catalog-filter.js";
import { ensureCatalogLoaded } from "./catalog/catalog-repository.js";
import { elements } from "./core/elements.js";
import { state } from "./core/state.js";
import { taxonomyByLanguage, uiByLanguage } from "./data/localization.js";
import { debounce } from "./utils/debounce.js";
import { renderItems } from "./ui/catalog-view.js";
import { bindDialogs, openItem } from "./ui/dialogs.js";
import { renderFilters } from "./ui/filters.js";
import { renderLanguageSwitch } from "./ui/language-switch.js";
import { applyLocale } from "./ui/locale.js";
import { applyTheme, renderThemeSwitch } from "./ui/theme-switch.js";

init();

async function init() {
  bindEvents();
  applyTheme(state);
  renderLanguageSwitch(state, elements, setLanguage);
  renderThemeSwitch(state, elements);
  await ensureCatalogLoaded(state, state.language);
  applyCurrentLocale();
  loadItems();
}

function bindEvents() {
  elements.search.addEventListener("input", debounce((event) => {
    state.query = event.target.value;
    loadItems();
  }, 180));

  elements.reset.addEventListener("click", () => {
    state.country = "";
    state.category = "";
    state.query = "";
    elements.search.value = "";
    renderCurrentFilters();
    loadItems();
  });

  bindDialogs(elements);
}

async function setLanguage(language) {
  if (language === state.language) {
    return;
  }

  state.language = language;
  window.localStorage.setItem("weapon-guid-language", language);
  renderLanguageSwitch(state, elements, setLanguage);
  applyCurrentLocale();
  await ensureCatalogLoaded(state, language);
  loadItems();
}

function applyCurrentLocale() {
  applyLocale(state, elements, getUi(), renderCurrentFilters);
}

function renderCurrentFilters() {
  renderFilters(state, elements, getTaxonomy(), getUi(), () => {
    renderCurrentFilters();
    loadItems();
  });
}

function loadItems() {
  const items = state.catalogs[state.language] || [];
  state.items = filterItems(items, state);
  renderCurrentItems();

  if (elements.dialog.open && state.selectedItemId) {
    const activeItem = items.find(item => item.id === state.selectedItemId);
    if (activeItem) {
      openCurrentItem(activeItem);
    }
  }
}

function renderCurrentItems() {
  renderItems(state, elements, getTaxonomy(), getUi(), openCurrentItem);
}

function openCurrentItem(item) {
  openItem(item, state, elements, getUi());
}

function getTaxonomy() {
  return taxonomyByLanguage[state.language];
}

function getUi() {
  return uiByLanguage[state.language];
}
