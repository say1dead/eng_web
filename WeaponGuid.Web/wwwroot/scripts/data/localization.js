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
      { code: 1, name: "РЎРЎРЎР " },
      { code: 2, name: "Р“РµСЂРјР°РЅРёСЏ" },
      { code: 3, name: "РЎРЁРђ" },
      { code: 4, name: "Р’РµР»РёРєРѕР±СЂРёС‚Р°РЅРёСЏ" }
    ],
    categories: [
      { code: "1", name: "РђРІС‚РѕРјР°С‚РёС‡РµСЃРєРѕРµ РѕСЂСѓР¶РёРµ", kind: "weapon" },
      { code: "2", name: "Р’РёРЅС‚РѕРІРєРё", kind: "weapon" },
      { code: "3", name: "РџСѓР»РµРјРµС‚С‹", kind: "weapon" },
      { code: "4", name: "РўР°РЅРєРё", kind: "vehicle" },
      { code: "5", name: "РЎР°РјРѕР»РµС‚С‹", kind: "aircraft" },
      { code: "6", name: "Р—РµРЅРёС‚РЅС‹Рµ СѓСЃС‚Р°РЅРѕРІРєРё", kind: "vehicle" }
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
    year: "Р“РѕРґ РїСЂРёРЅСЏС‚РёСЏ",
    caliber: "РљР°Р»РёР±СЂ",
    fire_modes: "Р РµР¶РёРјС‹ СЃС‚СЂРµР»СЊР±С‹",
    rate_of_fire: "РЎРєРѕСЂРѕСЃС‚СЂРµР»СЊРЅРѕСЃС‚СЊ",
    range: "Р”Р°Р»СЊРЅРѕСЃС‚СЊ / РІР·Р»РµС‚",
    weight: "РњР°СЃСЃР°",
    armor: "Р‘СЂРѕРЅСЏ",
    max_spead: "РЎРєРѕСЂРѕСЃС‚СЊ",
    guns_and_spead: "Р’РѕРѕСЂСѓР¶РµРЅРёРµ",
    max_stats: "Р›РµС‚РЅС‹Рµ С…Р°СЂР°РєС‚РµСЂРёСЃС‚РёРєРё",
    weapons: "Р’РѕРѕСЂСѓР¶РµРЅРёРµ"
  }
};

export const uiByLanguage = {
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
    documentTitle: "РЎРїСЂР°РІРѕС‡РЅРёРє РІРѕРѕСЂСѓР¶РµРЅРёСЏ",
    eyebrow: "20 РІРµРє",
    heroTitle: "РЎРїСЂР°РІРѕС‡РЅРёРє РІРѕРѕСЂСѓР¶РµРЅРёСЏ",
    searchLabel: "РџРѕРёСЃРє",
    searchPlaceholder: "РќР°Р·РІР°РЅРёРµ, СЃС‚СЂР°РЅР°, РѕРїРёСЃР°РЅРёРµ",
    countryTitle: "РЎС‚СЂР°РЅР°",
    categoryTitle: "РљР°С‚РµРіРѕСЂРёСЏ",
    itemCountLabel: "РѕР±СЉРµРєС‚РѕРІ РІ РєР°С‚Р°Р»РѕРіРµ",
    resetFilters: "РЎР±СЂРѕСЃРёС‚СЊ С„РёР»СЊС‚СЂС‹",
    creatorsButton: "РђРІС‚РѕСЂС‹",
    creatorsEyebrow: "РРЅС„РѕСЂРјР°С†РёСЏ",
    creatorsTitle: "РљРѕРјР°РЅРґР°",
    creatorLines: [
      "<strong>Kochurov Sergey</strong> - backend.",
      "<strong>Suslin Akim</strong> - С‚РµСЃС‚С‹ Рё СЃР±РѕСЂ РґР°РЅРЅС‹С….",
      "<strong>Kuznetcov Kirill</strong> - team lead.",
      "<strong>Bodorin Gregory</strong> - frontend."
    ],
    creatorsNote: "Р”Р°РЅРЅС‹Рµ СЃРѕР±СЂР°РЅС‹ РёР· РѕС‚РєСЂС‹С‚С‹С… РёСЃС‚РѕС‡РЅРёРєРѕРІ.",
    all: "Р’СЃРµ",
    emptyState: "РџРѕ СЌС‚РёРј С„РёР»СЊС‚СЂР°Рј РЅРёС‡РµРіРѕ РЅРµ РЅР°Р№РґРµРЅРѕ.",
    noImage: "РќРµС‚ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ",
    noChange: "Р‘РµР· РёР·РјРµРЅРµРЅРёР№",
    noDescription: "РћРїРёСЃР°РЅРёРµ РїРѕРєР° РЅРµ РґРѕР±Р°РІР»РµРЅРѕ.",
    imageNotFound: "РР·РѕР±СЂР°Р¶РµРЅРёРµ РЅРµ РЅР°Р№РґРµРЅРѕ",
    timelineCategory: "РљР°С‚РµРіРѕСЂРёСЏ",
    yearUnknown: "Р“РѕРґ РЅРµ СѓРєР°Р·Р°РЅ",
    closeLabel: "Р—Р°РєСЂС‹С‚СЊ"
  }
};

export const decades = Array.from({ length: 10 }, (_, index) => {
  const start = 1900 + index * 10;
  return { start, end: start + 10, label: `${start}-${start + 10}` };
});
