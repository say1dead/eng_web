using System.Text.Json.Serialization;

namespace WeaponGuid.Web.Models;

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
