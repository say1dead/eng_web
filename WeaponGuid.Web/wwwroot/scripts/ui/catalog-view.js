import { decades } from "../data/localization.js?v=encoding-20260428";
import { formatMeta, getAdoptionYear, getAdoptionYearNumber, getDecade } from "../catalog/catalog-model.js";
import { setImageSource } from "../utils/images.js";

export function renderItems(state, elements, taxonomy, ui, openItem) {
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
    renderTimeline(state, elements, taxonomy, ui, openItem);
    return;
  }

  for (const item of state.items) {
    elements.grid.append(createCatalogCard(item, elements, ui, openItem));
  }
}

function createCatalogCard(item, elements, ui, openItem) {
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

  meta.textContent = formatMeta(item, ui);
  title.textContent = item.name;
  button.addEventListener("click", () => openItem(item));
  return node;
}

function renderTimeline(state, elements, taxonomy, ui, openItem) {
  const tableWrap = document.createElement("div");
  tableWrap.className = "timeline-wrap";

  const table = document.createElement("table");
  table.className = "timeline-table";
  table.append(createTimelineHead(ui), createTimelineBody(state, taxonomy, ui, openItem));

  tableWrap.append(table);
  elements.grid.append(tableWrap);
}

function createTimelineHead(ui) {
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  headRow.append(createCell("th", ui.timelineCategory));
  for (const decade of decades) {
    headRow.append(createCell("th", decade.label));
  }
  thead.append(headRow);
  return thead;
}

function createTimelineBody(state, taxonomy, ui, openItem) {
  const tbody = document.createElement("tbody");
  const visibleCategories = taxonomy.categories.filter(category =>
    !state.category || category.code === state.category
  );

  for (const category of visibleCategories) {
    tbody.append(createTimelineRow(category, state.items, ui, openItem));
  }

  return tbody;
}

function createTimelineRow(category, items, ui, openItem) {
  const row = document.createElement("tr");
  row.append(createCell("th", category.name));
  let lastKnownItem = null;

  for (const decade of decades) {
    const cell = createCell("td", "");
    const decadeItems = items
      .filter(item => item.categoryCode === category.code && getDecade(item, ui) === decade.start)
      .sort((left, right) => getAdoptionYearNumber(left, ui) - getAdoptionYearNumber(right, ui));

    if (decadeItems.length === 0) {
      cell.className = "timeline-empty";
      if (lastKnownItem) {
        cell.append(createCarryoverNotice(lastKnownItem, ui, openItem));
      }
    }

    for (const item of decadeItems) {
      cell.append(createTimelineItem(item, ui, openItem));
    }

    if (decadeItems.length > 0) {
      lastKnownItem = decadeItems.at(-1);
    }

    row.append(cell);
  }

  return row;
}

function createCell(tagName, text) {
  const cell = document.createElement(tagName);
  cell.textContent = text;
  return cell;
}

function createTimelineItem(item, ui, openItem) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "timeline-item";
  button.title = `${item.name}, ${getAdoptionYear(item, ui)}`;

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
  year.textContent = getAdoptionYear(item, ui);

  button.append(thumb, name, year);
  button.addEventListener("click", () => openItem(item));
  return button;
}

function createCarryoverNotice(item, ui, openItem) {
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
