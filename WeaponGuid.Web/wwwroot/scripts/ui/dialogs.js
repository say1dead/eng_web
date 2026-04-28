import { formatMeta } from "../catalog/catalog-model.js";
import { setImageSource } from "../utils/images.js";

export function bindDialogs(elements) {
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

export function openItem(item, state, elements, ui) {
  state.selectedItemId = item.id;
  elements.dialogImage.alt = item.name;
  setImageSource(elements.dialogImage, item.imageUrl, {
    loading: "eager",
    onMissing: () => {
      elements.dialogImage.removeAttribute("src");
      elements.dialogImage.alt = ui.imageNotFound;
    }
  });
  elements.dialogMeta.textContent = formatMeta(item, ui);
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
