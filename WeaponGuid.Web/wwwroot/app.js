const taxonomyByLanguage = {
  en: {
    countries: [
      { code: 1, name: "Soviet Union" },
      { code: 2, name: "Germany" },
      { code: 3, name: "United States" },
      { code: 4, name: "United Kingdom" }
    ],
    categories: [
      { code: "1", name: "Automatic Weapons", kind: "weapon" },
      { code: "2", name: "Rifles", kind: "weapon" },
      { code: "3", name: "Machine Guns", kind: "weapon" },
      { code: "4", name: "Tanks", kind: "vehicle" },
      { code: "5", name: "Aircraft", kind: "aircraft" },
      { code: "6", name: "Anti-Aircraft", kind: "vehicle" }
    ]
  },
  ru: {
    countries: [
      { code: 1, name: "СССР" },
      { code: 2, name: "Германия" },
      { code: 3, name: "США" },
      { code: 4, name: "Великобритания" }
    ],
    categories: [
      { code: "1", name: "Автоматическое оружие", kind: "weapon" },
      { code: "2", name: "Винтовки", kind: "weapon" },
      { code: "3", name: "Пулеметы", kind: "weapon" },
      { code: "4", name: "Танки", kind: "vehicle" },
      { code: "5", name: "Самолеты", kind: "aircraft" },
      { code: "6", name: "Зенитные установки", kind: "vehicle" }
    ]
  }
};

const specLabelsByLanguage = {
  en: {
    year: "Year adopted",
    caliber: "Caliber",
    fire_modes: "Fire modes",
    rate_of_fire: "Rate of fire",
    range: "Range / takeoff",
    weight: "Weight",
    armor: "Armor",
    max_spead: "Speed",
    guns_and_spead: "Armament",
    max_stats: "Flight performance",
    weapons: "Armament"
  },
  ru: {
    year: "Год принятия",
    caliber: "Калибр",
    fire_modes: "Режимы стрельбы",
    rate_of_fire: "Скорострельность",
    range: "Дальность / взлет",
    weight: "Масса",
    armor: "Броня",
    max_spead: "Скорость",
    guns_and_spead: "Вооружение",
    max_stats: "Летные характеристики",
    weapons: "Вооружение"
  }
};

const uiByLanguage = {
  en: {
    htmlLang: "en",
    documentTitle: "Weapons Guid",
    eyebrow: "20th century",
    heroTitle: "Weapons Reference",
    searchLabel: "Search",
    searchPlaceholder: "Name, country, description",
    countryTitle: "Country",
    categoryTitle: "Category",
    itemCountLabel: "items in the catalog",
    resetFilters: "Reset filters",
    creatorsButton: "Creators",
    creatorsEyebrow: "Information",
    creatorsTitle: "Info",
    creatorLines: [
      "<strong>Kochurov Sergey</strong> - backend.",
      "<strong>Suslin Akim</strong> - test + data collect.",
      "<strong>Kuznetcov Kirill</strong> - team lead.",
      "<strong>Bodorin Gregory</strong> - frontend."
    ],
    creatorsNote: "Data was collected from open sources.",
    all: "All",
    emptyState: "No items match these filters.",
    noImage: "No image",
    noChange: "No change",
    noDescription: "No description has been added yet.",
    imageNotFound: "Image not found",
    timelineCategory: "Category",
    yearUnknown: "Year unknown",
    closeLabel: "Close"
  },
  ru: {
    htmlLang: "ru",
    documentTitle: "Справочник вооружения",
    eyebrow: "20 век",
    heroTitle: "Справочник вооружения",
    searchLabel: "Поиск",
    searchPlaceholder: "Название, страна, описание",
    countryTitle: "Страна",
    categoryTitle: "Категория",
    itemCountLabel: "объектов в каталоге",
    resetFilters: "Сбросить фильтры",
    creatorsButton: "Авторы",
    creatorsEyebrow: "Информация",
    creatorsTitle: "Команда",
    creatorLines: [
      "<strong>Kochurov Sergey</strong> - backend.",
      "<strong>Suslin Akim</strong> - тесты и сбор данных.",
      "<strong>Kuznetcov Kirill</strong> - team lead.",
      "<strong>Bodorin Gregory</strong> - frontend."
    ],
    creatorsNote: "Данные собраны из открытых источников.",
    all: "Все",
    emptyState: "По этим фильтрам ничего не найдено.",
    noImage: "Нет изображения",
    noChange: "Без изменений",
    noDescription: "Описание пока не добавлено.",
    imageNotFound: "Изображение не найдено",
    timelineCategory: "Категория",
    yearUnknown: "Год не указан",
    closeLabel: "Закрыть"
  }
};

const decades = Array.from({ length: 10 }, (_, index) => {
  const start = 1900 + index * 10;
  return { start, end: start + 10, label: `${start}-${start + 10}` };
});

const assetBaseUrl = new URL(".", document.currentScript?.src || window.location.href);

const state = {
  language: getInitialLanguage(),
  theme: getInitialTheme(),
  country: "",
  category: "",
  query: "",
  catalogs: {},
  items: [],
  selectedItemId: ""
};

const elements = {
  languageSwitch: document.querySelector("#languageSwitch"),
  themeSwitch: document.querySelector("#themeSwitch"),
  creatorsButton: document.querySelector("#creatorsButton"),
  heroEyebrow: document.querySelector("#heroEyebrow"),
  heroTitle: document.querySelector("#heroTitle"),
  searchLabel: document.querySelector("#searchLabel"),
  search: document.querySelector("#searchInput"),
  countryTitle: document.querySelector("#countryTitle"),
  categoryTitle: document.querySelector("#categoryTitle"),
  countries: document.querySelector("#countryFilters"),
  categories: document.querySelector("#categoryFilters"),
  count: document.querySelector("#itemCount"),
  countLabel: document.querySelector("#itemCountLabel"),
  reset: document.querySelector("#resetFilters"),
  grid: document.querySelector("#catalogGrid"),
  template: document.querySelector("#cardTemplate"),
  dialog: document.querySelector("#itemDialog"),
  closeDialog: document.querySelector("#closeDialog"),
  dialogImage: document.querySelector("#dialogImage"),
  dialogMeta: document.querySelector("#dialogMeta"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogSpecs: document.querySelector("#dialogSpecs"),
  dialogDescription: document.querySelector("#dialogDescription"),
  creatorsDialog: document.querySelector("#creatorsDialog"),
  closeCreatorsDialog: document.querySelector("#closeCreatorsDialog"),
  creatorsEyebrow: document.querySelector("#creatorsEyebrow"),
  creatorsTitle: document.querySelector("#creatorsTitle"),
  creatorLine1: document.querySelector("#creatorLine1"),
  creatorLine2: document.querySelector("#creatorLine2"),
  creatorLine3: document.querySelector("#creatorLine3"),
  creatorLine4: document.querySelector("#creatorLine4"),
  creatorsNote: document.querySelector("#creatorsNote")
};

init();

async function init() {
  bindEvents();
  applyTheme();
  renderLanguageSwitch();
  renderThemeSwitch();
  await ensureCatalogLoaded(state.language);
  applyLocale();
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
    renderFilters();
    loadItems();
  });

  elements.closeDialog.addEventListener("click", () => elements.dialog.close());
  elements.dialog.addEventListener("click", (event) => {
    if (event.target === elements.dialog) {
      elements.dialog.close();
    }
  });

  elements.creatorsButton.addEventListener("click", () => elements.creatorsDialog.showModal());
  elements.closeCreatorsDialog.addEventListener("click", () => elements.creatorsDialog.close());
  elements.creatorsDialog.addEventListener("click", (event) => {
    if (event.target === elements.creatorsDialog) {
      elements.creatorsDialog.close();
    }
  });
}

async function setLanguage(language) {
  if (language === state.language) {
    return;
  }

  state.language = language;
  window.localStorage.setItem("weapon-guid-language", language);
  renderLanguageSwitch();
  applyLocale();
  await ensureCatalogLoaded(language);
  loadItems();
}

function renderLanguageSwitch() {
  const buttons = elements.languageSwitch.querySelectorAll("button[data-language]");
  for (const button of buttons) {
    const language = button.dataset.language;
    button.classList.toggle("active", state.language === language);
    if (button.dataset.bound === "true") {
      continue;
    }

    button.dataset.bound = "true";
    button.addEventListener("click", () => {
      void setLanguage(language);
    });
  }
}

function setTheme(theme) {
  if (theme === state.theme) {
    return;
  }

  state.theme = theme;
  window.localStorage.setItem("weapon-guid-theme", theme);
  applyTheme();
  renderThemeSwitch();
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
}

function renderThemeSwitch() {
  const labelsByLanguage = {
    en: {
      light: "Light theme",
      dark: "Dark theme"
    },
    ru: {
      light: "\u0421\u0432\u0435\u0442\u043b\u0430\u044f \u0442\u0435\u043c\u0430",
      dark: "\u0422\u0435\u043c\u043d\u0430\u044f \u0442\u0435\u043c\u0430"
    }
  };
  const labels = labelsByLanguage[state.language] || labelsByLanguage.en;
  const buttons = elements.themeSwitch.querySelectorAll("button[data-theme-option]");

  for (const button of buttons) {
    const theme = button.dataset.themeOption;
    const label = labels[theme] || theme;
    button.setAttribute("aria-label", label);
    button.title = label;
    button.classList.toggle("active", state.theme === theme);
    if (button.dataset.bound === "true") {
      continue;
    }

    button.dataset.bound = "true";
    button.addEventListener("click", () => setTheme(theme));
  }
}

async function ensureCatalogLoaded(language) {
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

function applyLocale() {
  const ui = getUi();

  document.documentElement.lang = ui.htmlLang;
  document.title = ui.documentTitle;
  elements.heroEyebrow.textContent = ui.eyebrow;
  elements.heroTitle.textContent = ui.heroTitle;
  elements.searchLabel.textContent = ui.searchLabel;
  elements.search.placeholder = ui.searchPlaceholder;
  elements.countryTitle.textContent = ui.countryTitle;
  elements.categoryTitle.textContent = ui.categoryTitle;
  elements.countLabel.textContent = ui.itemCountLabel;
  elements.reset.textContent = ui.resetFilters;
  elements.creatorsButton.textContent = ui.creatorsButton;
  elements.creatorsEyebrow.textContent = ui.creatorsEyebrow;
  elements.creatorsTitle.textContent = ui.creatorsTitle;
  elements.creatorLine1.innerHTML = ui.creatorLines[0];
  elements.creatorLine2.innerHTML = ui.creatorLines[1];
  elements.creatorLine3.innerHTML = ui.creatorLines[2];
  elements.creatorLine4.innerHTML = ui.creatorLines[3];
  elements.creatorsNote.textContent = ui.creatorsNote;
  elements.closeDialog.setAttribute("aria-label", ui.closeLabel);
  elements.closeCreatorsDialog.setAttribute("aria-label", ui.closeLabel);
  renderThemeSwitch();
  renderFilters();
}

function renderFilters() {
  const taxonomy = getTaxonomy();
  const ui = getUi();

  renderSegment(elements.countries, [
    { code: "", name: ui.all },
    ...taxonomy.countries.map(country => ({ code: String(country.code), name: country.name }))
  ], "country");

  renderSegment(elements.categories, [
    { code: "", name: ui.all },
    ...taxonomy.categories
  ], "category");
}

function renderSegment(container, options, stateKey) {
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
      renderFilters();
      loadItems();
    });
    container.append(button);
  }
}

function loadItems() {
  const search = state.query.trim().toLowerCase();
  const items = state.catalogs[state.language] || [];

  state.items = items.filter(item => {
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

  renderItems();

  if (elements.dialog.open && state.selectedItemId) {
    const activeItem = items.find(item => item.id === state.selectedItemId);
    if (activeItem) {
      openItem(activeItem);
    }
  }
}

function renderItems() {
  const ui = getUi();
  elements.count.textContent = state.items.length;
  elements.grid.replaceChildren();
  elements.grid.classList.toggle("timeline-mode", Boolean(state.country));

  if (state.items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = ui.emptyState;
    elements.grid.append(empty);
    return;
  }

  if (state.country) {
    renderTimeline();
    return;
  }

  for (const item of state.items) {
    const node = elements.template.content.firstElementChild.cloneNode(true);
    const button = node.querySelector("button");
    const imageWrap = node.querySelector(".image-wrap");
    const image = node.querySelector("img");
    const meta = node.querySelector(".card-meta");
    const title = node.querySelector("h2");

    image.alt = item.name;
    setImageSource(image, item.imageUrl, {
      loading: "lazy",
      onMissing: () => {
        image.remove();
        imageWrap.dataset.emptyLabel = ui.noImage;
        imageWrap.classList.add("missing");
      }
    });

    meta.textContent = formatMeta(item);
    title.textContent = item.name;
    button.addEventListener("click", () => openItem(item));
    elements.grid.append(node);
  }
}

function renderTimeline() {
  const ui = getUi();
  const taxonomy = getTaxonomy();
  const tableWrap = document.createElement("div");
  tableWrap.className = "timeline-wrap";

  const table = document.createElement("table");
  table.className = "timeline-table";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  headRow.append(createCell("th", ui.timelineCategory));
  for (const decade of decades) {
    headRow.append(createCell("th", decade.label));
  }
  thead.append(headRow);

  const tbody = document.createElement("tbody");
  const visibleCategories = taxonomy.categories.filter(category =>
    !state.category || category.code === state.category
  );

  for (const category of visibleCategories) {
    const row = document.createElement("tr");
    row.append(createCell("th", category.name));
    let lastKnownItem = null;

    for (const decade of decades) {
      const cell = createCell("td", "");
      const items = state.items
        .filter(item => item.categoryCode === category.code && getDecade(item) === decade.start)
        .sort((left, right) => getAdoptionYearNumber(left) - getAdoptionYearNumber(right));

      if (items.length === 0) {
        cell.className = "timeline-empty";
        if (lastKnownItem) {
          cell.append(createCarryoverNotice(lastKnownItem));
        }
      }

      for (const item of items) {
        cell.append(createTimelineItem(item));
      }

      if (items.length > 0) {
        lastKnownItem = items.at(-1);
      }

      row.append(cell);
    }

    tbody.append(row);
  }

  table.append(thead, tbody);
  tableWrap.append(table);
  elements.grid.append(tableWrap);
}

function createCell(tagName, text) {
  const cell = document.createElement(tagName);
  cell.textContent = text;
  return cell;
}

function createTimelineItem(item) {
  const ui = getUi();
  const button = document.createElement("button");
  button.type = "button";
  button.className = "timeline-item";
  button.title = `${item.name}, ${getAdoptionYear(item)}`;

  const thumb = document.createElement("span");
  thumb.className = "timeline-thumb";

  const image = document.createElement("img");
  image.alt = item.name;
  setImageSource(image, item.imageUrl, {
    loading: "eager",
    onMissing: () => {
      image.remove();
      thumb.dataset.emptyLabel = ui.noImage;
      thumb.classList.add("missing");
    }
  });
  thumb.append(image);

  const name = document.createElement("span");
  name.className = "timeline-name";
  name.textContent = item.name;

  const year = document.createElement("span");
  year.className = "timeline-year";
  year.textContent = getAdoptionYear(item);

  button.append(thumb, name, year);
  button.addEventListener("click", () => openItem(item));
  return button;
}

function createCarryoverNotice(item) {
  const ui = getUi();
  const button = document.createElement("button");
  button.type = "button";
  button.className = "timeline-carryover";
  button.title = item.name;
  button.addEventListener("click", () => openItem(item));

  const label = document.createElement("span");
  label.textContent = ui.noChange;

  const name = document.createElement("strong");
  name.textContent = item.name;

  button.append(label, name);
  return button;
}

function openItem(item) {
  const ui = getUi();
  state.selectedItemId = item.id;
  elements.dialogImage.alt = item.name;
  setImageSource(elements.dialogImage, item.imageUrl, {
    loading: "eager",
    onMissing: () => {
      elements.dialogImage.removeAttribute("src");
      elements.dialogImage.alt = ui.imageNotFound;
    }
  });
  elements.dialogMeta.textContent = formatMeta(item);
  elements.dialogTitle.textContent = item.name;
  elements.dialogSpecs.replaceChildren();

  for (const [label, value] of Object.entries(item.specs || {})) {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = label;
    dd.textContent = value;
    elements.dialogSpecs.append(dt, dd);
  }

  elements.dialogDescription.textContent = item.description || ui.noDescription;
  if (!elements.dialog.open) {
    elements.dialog.showModal();
  }
}

function normalizeItem(raw, language) {
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

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function setImageSource(image, url, options = {}) {
  const { loading, onMissing } = options;
  let attempts = 0;

  if (loading) {
    image.loading = loading;
  }

  image.dataset.imageUrl = url;
  image.onerror = () => {
    if (image.dataset.imageUrl !== url) {
      return;
    }

    attempts += 1;
    if (attempts === 1) {
      image.src = withRetryToken(url);
      return;
    }

    image.onerror = null;
    onMissing?.();
  };
  image.onload = () => {
    image.onerror = null;
  };
  image.src = url;
}

function withRetryToken(url) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}retry=${Date.now()}`;
}

function assetUrl(path) {
  return new URL(path, assetBaseUrl).toString();
}

function formatMeta(item) {
  return `${item.country} | ${item.category} | ${getAdoptionYear(item)}`;
}

function getAdoptionYear(item) {
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

  return getUi().yearUnknown;
}

function getAdoptionYearNumber(item) {
  const year = Number(getAdoptionYear(item));
  return Number.isFinite(year) ? year : 0;
}

function getDecade(item) {
  const year = getAdoptionYearNumber(item);
  if (year < 1900) {
    return 1900;
  }
  if (year >= 2000) {
    return 1990;
  }
  return Math.floor(year / 10) * 10;
}

function getInitialLanguage() {
  const savedLanguage = window.localStorage.getItem("weapon-guid-language");
  if (savedLanguage === "en" || savedLanguage === "ru") {
    return savedLanguage;
  }

  return navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en";
}

function getInitialTheme() {
  const savedTheme = window.localStorage.getItem("weapon-guid-theme");
  return savedTheme === "dark" ? "dark" : "light";
}

function getTaxonomy() {
  return taxonomyByLanguage[state.language];
}

function getUi() {
  return uiByLanguage[state.language];
}

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
