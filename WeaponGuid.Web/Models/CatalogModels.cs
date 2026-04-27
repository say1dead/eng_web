using System.Text.Json.Serialization;

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

public sealed record CatalogFilters(
    string? Country,
    string? Category,
    string? Query);

public sealed record TaxonomyDto(
    IReadOnlyList<CountryDto> Countries,
    IReadOnlyList<CategoryDto> Categories);

public sealed record CountryDto(int Code, string Name);

public sealed record CategoryDto(string Code, string Name, string Kind);

public sealed record RawCatalogItem
{
    [JsonPropertyName("id")]
    public string Id { get; init; } = "";

    [JsonPropertyName("name")]
    public string Name { get; init; } = "";

    [JsonPropertyName("country")]
    public string Country { get; init; } = "";

    [JsonExtensionData]
    public Dictionary<string, object?> Extra { get; init; } = new();
}
