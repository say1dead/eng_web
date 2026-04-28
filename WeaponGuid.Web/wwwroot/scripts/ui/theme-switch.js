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

export function applyTheme(state) {
  document.documentElement.dataset.theme = state.theme;
}

export function setTheme(state, theme, elements) {
  if (theme === state.theme) {
    return;
  }

  state.theme = theme;
  window.localStorage.setItem("weapon-guid-theme", theme);
  applyTheme(state);
  renderThemeSwitch(state, elements);
}

export function renderThemeSwitch(state, elements) {
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
    button.addEventListener("click", () => setTheme(state, theme, elements));
  }
}
