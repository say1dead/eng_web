namespace WeaponGuid.Web.Models;

public sealed record CatalogItem(
    string Id,
    string Name,
    string Country,
    int CountryCode,
    string CategoryCode,
    string Category,
    int Position,
    string Kind,
    string ImageUrl,
    IReadOnlyDictionary<string, string> Specs,
    string Description);
