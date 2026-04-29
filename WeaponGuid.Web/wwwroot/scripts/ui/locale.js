import { renderThemeSwitch } from "./theme-switch.js";

export function applyLocale(state, elements, ui, renderFilters) {
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
  elements.adBannerLeft.textContent = ui.adBanner;
  elements.adBannerRight.textContent = ui.adBanner;
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
  renderThemeSwitch(state, elements);
  renderFilters();
}
