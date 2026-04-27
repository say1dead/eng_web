import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = ["weapons.json", "wheel_auto.json", "fly_auto.json"]

COUNTRIES = {
    "1": "Soviet Union",
    "2": "Germany",
    "3": "United States",
    "4": "United Kingdom",
}

CATEGORIES = {
    "1": "automatic weapon",
    "2": "rifle",
    "3": "machine gun",
    "4": "tank",
    "5": "aircraft",
    "6": "anti-aircraft system",
}

CYRILLIC_TO_LATIN = str.maketrans({
    "А": "A", "Б": "B", "В": "V", "Г": "G", "Д": "D", "Е": "E", "Ё": "Yo", "Ж": "Zh",
    "З": "Z", "И": "I", "Й": "Y", "К": "K", "Л": "L", "М": "M", "Н": "N", "О": "O",
    "П": "P", "Р": "R", "С": "S", "Т": "T", "У": "U", "Ф": "F", "Х": "Kh", "Ц": "Ts",
    "Ч": "Ch", "Ш": "Sh", "Щ": "Shch", "Ъ": "", "Ы": "Y", "Ь": "", "Э": "E", "Ю": "Yu",
    "Я": "Ya", "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo",
    "ж": "zh", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n",
    "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "kh",
    "ц": "ts", "ч": "ch", "ш": "sh", "щ": "shch", "ъ": "", "ы": "y", "ь": "", "э": "e",
    "ю": "yu", "я": "ya",
})

NAME_REPLACEMENTS = [
    ("Автомат Федорова", "Fedorov Automatic Rifle"),
    ("Автомат Фёдорова", "Fedorov Automatic Rifle"),
    ("Винтовка Мосина", "Mosin Rifle"),
    ("Мосина", "Mosin"),
    ("Максим", "Maxim"),
    ("ППШ", "PPSh"),
    ("ППД", "PPD"),
    ("АКС", "AKS"),
    ("АКМ", "AKM"),
    ("АК", "AK"),
    ("СВТ", "SVT"),
    ("СКС", "SKS"),
    ("СВД", "SVD"),
    ("ПКП Печенег", "PKP Pecheneg"),
    ("Печенег", "Pecheneg"),
    ("ПКМ", "PKM"),
    ("ПК", "PK"),
    ("ДП", "DP"),
    ("РПД", "RPD"),
    ("СГ", "SG"),
    ("МиГ", "MiG"),
    ("миг", "MiG"),
    ("Су", "Su"),
    ("Ил", "Il"),
    ("ИЛ", "Il"),
    ("И-16", "I-16"),
    ("У-2", "U-2"),
    ("ЗСУ", "ZSU"),
    ("ЗРК", "SAM"),
    ("ГАЗ", "GAZ"),
]

TEXT_REPLACEMENTS = [
    ("Год принятия на вооружение", "Year adopted"),
    ("Год принятия", "Year adopted"),
    ("Калибр", "Caliber"),
    ("Режимы стрельбы", "Fire modes"),
    ("одиночный", "single"),
    ("автоматический", "automatic"),
    ("Скорострельность", "Rate of fire"),
    ("Прицельная дальность", "Effective range"),
    ("Вес", "Weight"),
    ("Броня корпуса (лоб / борт / корма)", "Hull armor (front / side / rear)"),
    ("Броня башни (лоб / борт / корма)", "Turret armor (front / side / rear)"),
    ("Броня башня (лоб / борт / корма)", "Turret armor (front / side / rear)"),
    ("Максимальная скорость вперед", "Maximum forward speed"),
    ("Максимальная скорость вперёд", "Maximum forward speed"),
    ("Максимальная скорость назад", "Maximum reverse speed"),
    ("Длина разбега", "Takeoff run"),
    ("Скороподъёмность", "Climb rate"),
    ("Скороподъемность", "Climb rate"),
    ("Максимальная скорость", "Maximum speed"),
    ("Максимальная высота", "Service ceiling"),
    ("Предельная скорость", "Limit speed"),
    ("Предельное число Маха", "Mach limit"),
    ("точек подвеса", "hardpoints"),
    ("точки подвеса", "hardpoints"),
    ("точка подвеса", "hardpoint"),
    ("выстрелов / мин", "rounds/min"),
    ("выстрелов/мин", "rounds/min"),
    ("метров / сек", "m/s"),
    ("метров/сек", "m/s"),
    ("метров", "m"),
    ("метра", "m"),
    ("мм", "mm"),
    ("тонн", "tons"),
    ("тонны", "tons"),
    ("км / ч", "km/h"),
    ("км/ч", "km/h"),
    ("пулемёт", "machine gun"),
    ("пулемет", "machine gun"),
    ("пулемёта", "machine guns"),
    ("пулемета", "machine guns"),
    ("пушка", "gun"),
    ("пушки", "guns"),
    ("автомата", "automatic rifles"),
]

ASCII_REPLACEMENTS = {
    "—": "-", "–": "-", "−": "-", "×": "x", "Г—": "x", "В«": "\"", "В»": "\"",
    "«": "\"", "»": "\"", "“": "\"", "”": "\"", "’": "'", "…": "...", "\u00a0": " ",
}


def score(text: str) -> int:
    cyrillic = sum("А" <= ch <= "я" or ch in "Ёё" for ch in text)
    broken = sum(ch in "РСÐÑ" for ch in text) + text.count("вЂ") * 3
    return cyrillic * 3 - broken * 2


def repair(text: object) -> str:
    if text is None:
        return ""
    value = str(text)
    if any(marker in value for marker in ("Р", "С", "вЂ", "Г—", "В«")):
        try:
            fixed = value.encode("cp1251").decode("utf-8")
            if score(fixed) >= score(value):
                value = fixed
        except UnicodeError:
            pass
    for src, dst in ASCII_REPLACEMENTS.items():
        value = value.replace(src, dst)
    return re.sub(r"[ \t]+", " ", value).strip()


def transliterate(value: str) -> str:
    return repair(value).translate(CYRILLIC_TO_LATIN)


def translate_name(value: object) -> str:
    text = repair(value)
    for src, dst in NAME_REPLACEMENTS:
        text = text.replace(src, dst)
    return re.sub(r"\s+", " ", transliterate(text)).strip()


def translate_value(value: object) -> str:
    text = repair(value)
    for src, dst in TEXT_REPLACEMENTS:
        text = text.replace(src, dst)
    text = transliterate(text)
    text = re.sub(r"\s+([.,])", r"\1", text)
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def extract_year(item: dict) -> str:
    for candidate in (item.get("year", ""), item.get("description", "")):
        match = re.search(r"\b(18|19|20)\d{2}\b", repair(candidate))
        if match:
            return match.group(0)
    return ""


def make_description(item: dict) -> str:
    item_id = item.get("id", "")
    country = COUNTRIES.get(item_id[:1], item.get("country", "Unknown country"))
    category = CATEGORIES.get(item_id[1:2], "military item")
    year = extract_year(item)
    intro = f"{item['name']} is a {country} {category}"
    if year:
        intro += f" adopted in {year}"
    intro += "."

    return intro + " This entry is part of the twentieth-century military equipment catalog."


def translate_file(path: Path) -> None:
    data = json.loads(path.read_text(encoding="utf-8"))
    translated = []
    for item in data:
        new_item = {}
        for key, value in item.items():
            if key == "country":
                new_item[key] = COUNTRIES.get(str(item.get("id", ""))[:1], translate_value(value))
            elif key == "name":
                new_item[key] = translate_name(value)
            elif key == "description":
                continue
            elif isinstance(value, str):
                new_item[key] = translate_value(value)
            else:
                new_item[key] = value
        new_item["description"] = make_description(new_item)
        translated.append(new_item)
    path.write_text(json.dumps(translated, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {path.name}: {len(translated)} items")


for file_name in FILES:
    translate_file(ROOT / file_name)
