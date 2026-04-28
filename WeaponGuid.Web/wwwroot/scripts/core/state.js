export const state = {
  language: getInitialLanguage(),
  theme: getInitialTheme(),
  country: "",
  category: "",
  query: "",
  catalogs: {},
  items: [],
  selectedItemId: ""
};

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
