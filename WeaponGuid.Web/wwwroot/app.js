const state = {
  country: "",
  category: "",
  query: "",
  taxonomy: null,
  allItems: [],
  items: []
};

const decades = Array.from({ length: 10 }, (_, index) => {
  const start = 1900 + index * 10;
  return { start, end: start + 10, label: `${start}-${start + 10}` };
});

const elements = {
  countries: document.querySelector("#countryFilters"),
  categories: document.querySelector("#categoryFilters"),
  search: document.querySelector("#searchInput"),
  grid: document.querySelector("#catalogGrid"),
  count: document.querySelector("#itemCount"),
  reset: document.querySelector("#resetFilters"),
  template: document.querySelector("#cardTemplate"),
  dialog: document.querySelector("#itemDialog"),
  closeDialog: document.querySelector("#closeDialog"),
  dialogImage: document.querySelector("#dialogImage"),
  dialogMeta: document.querySelector("#dialogMeta"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogSpecs: document.querySelector("#dialogSpecs"),
  dialogDescription: document.querySelector("#dialogDescription"),
  creatorsButton: document.querySelector("#creatorsButton"),
  creatorsDialog: document.querySelector("#creatorsDialog"),
  closeCreatorsDialog: document.querySelector("#closeCreatorsDialog")
};

init();

async function init() {
  const [taxonomy, items] = await Promise.all([
    fetchJson("/api/taxonomy"),
    fetchJson("/api/items")
  ]);

  state.taxonomy = taxonomy;
  state.allItems = items;
  renderFilters();
  bindEvents();
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

function renderFilters() {
  renderSegment(elements.countries, [
    { code: "", name: "All" },
    ...state.taxonomy.countries.map(country => ({ code: String(country.code), name: country.name }))
  ], "country");

  renderSegment(elements.categories, [
    { code: "", name: "All" },
    ...state.taxonomy.categories
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
  state.items = state.allItems.filter(item => {
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
}

function renderItems() {
  elements.count.textContent = state.items.length;
  elements.grid.replaceChildren();
  elements.grid.classList.toggle("timeline-mode", Boolean(state.country));

  if (state.items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No items match these filters.";
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
        imageWrap.classList.add("missing");
      }
    });

    meta.textContent = `${item.country} · ${item.category} · ${getAdoptionYear(item)}`;
    title.textContent = item.name;
    button.addEventListener("click", () => openItem(item));
    elements.grid.append(node);
  }
}

function renderTimeline() {
  const tableWrap = document.createElement("div");
  tableWrap.className = "timeline-wrap";

  const table = document.createElement("table");
  table.className = "timeline-table";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  headRow.append(createCell("th", "Category"));
  for (const decade of decades) {
    headRow.append(createCell("th", decade.label));
  }
  thead.append(headRow);

  const tbody = document.createElement("tbody");
  const categories = state.taxonomy.categories.filter(category =>
    !state.category || category.code === state.category
  );

  for (const category of categories) {
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
  const button = document.createElement("button");
  button.type = "button";
  button.className = "timeline-carryover";
  button.title = item.name;
  button.addEventListener("click", () => openItem(item));

  const label = document.createElement("span");
  label.textContent = "No change";

  const name = document.createElement("strong");
  name.textContent = item.name;

  button.append(label, name);
  return button;
}

function openItem(item) {
  elements.dialogImage.alt = item.name;
  setImageSource(elements.dialogImage, item.imageUrl, {
    loading: "eager",
    onMissing: () => {
      elements.dialogImage.removeAttribute("src");
      elements.dialogImage.alt = "Image not found";
    }
  });
  elements.dialogMeta.textContent = `${item.country} · ${item.category} · ${getAdoptionYear(item)}`;
  elements.dialogTitle.textContent = item.name;
  elements.dialogSpecs.replaceChildren();

  for (const [label, value] of Object.entries(item.specs)) {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = label;
    dd.textContent = value;
    elements.dialogSpecs.append(dt, dd);
  }

  elements.dialogDescription.textContent = item.description || "No description has been added yet.";
  elements.dialog.showModal();
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

function getAdoptionYear(item) {
  const yearText = item.specs?.["Year adopted"] || "";
  const match = yearText.match(/\b(18|19|20)\d{2}\b/);
  return match ? match[0] : "Year unknown";
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

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
