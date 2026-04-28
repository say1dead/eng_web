export function renderLanguageSwitch(state, elements, onLanguageChange) {
  const buttons = elements.languageSwitch.querySelectorAll("button[data-language]");
  for (const button of buttons) {
    const language = button.dataset.language;
    button.classList.toggle("active", state.language === language);
    if (button.dataset.bound === "true") {
      continue;
    }

    button.dataset.bound = "true";
    button.addEventListener("click", () => {
      void onLanguageChange(language);
    });
  }
}
