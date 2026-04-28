using WeaponGuid.Web.Models;

namespace WeaponGuid.Web.Services;

public static class CatalogMetadata
{
    public static readonly CountryDto[] Countries =
    [
        new(1, "Soviet Union"),
        new(2, "Germany"),
        new(3, "United States"),
        new(4, "United Kingdom")
    ];

    public static readonly CategoryDto[] Categories =
    [
        new("1", "Automatic Weapons", "weapon"),
        new("2", "Rifles", "weapon"),
        new("3", "Machine Guns", "weapon"),
        new("4", "Tanks", "vehicle"),
        new("5", "Aircraft", "aircraft"),
        new("6", "Anti-Aircraft", "vehicle")
    ];

    public static readonly IReadOnlyDictionary<string, string> SpecLabels = new Dictionary<string, string>
    {
        ["year"] = "Year adopted",
        ["caliber"] = "Caliber",
        ["fire_modes"] = "Fire modes",
        ["rate_of_fire"] = "Rate of fire",
        ["range"] = "Range / takeoff",
        ["weight"] = "Weight",
        ["armor"] = "Armor",
        ["max_spead"] = "Speed",
        ["guns_and_spead"] = "Armament",
        ["max_stats"] = "Flight performance",
        ["weapons"] = "Armament"
    };

    public static string GetCountryName(int code) =>
        Countries.FirstOrDefault(country => country.Code == code)?.Name ?? $"Country {code}";

    public static CategoryDto GetCategory(string code) =>
        Categories.FirstOrDefault(category => category.Code == code) ?? new(code, $"Category {code}", "weapon");
}
