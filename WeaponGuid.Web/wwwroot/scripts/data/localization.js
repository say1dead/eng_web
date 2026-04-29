export const taxonomyByLanguage = {
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

export const specLabelsByLanguage = {
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
    year: "Год принятия на вооружение",
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

export const uiByLanguage = {
  en: {
    htmlLang: "en",
    documentTitle: "Weapons Guide",
    eyebrow: "20th century",
    heroTitle: "Weapons Reference",
    searchLabel: "Search",
    searchPlaceholder: "Name, country, description",
    countryTitle: "Country",
    categoryTitle: "Category",
    itemCountLabel: "items in the catalog",
    resetFilters: "Reset filters",
    adBanner: "Your ad could be here",
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
    adBanner: "Здесь могла быть ваша реклама",
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

export const decades = Array.from({ length: 10 }, (_, index) => {
  const start = 1900 + index * 10;
  return { start, end: start + 10, label: `${start}-${start + 10}` };
});
