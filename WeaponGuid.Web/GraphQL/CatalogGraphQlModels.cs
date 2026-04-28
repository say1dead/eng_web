using WeaponGuid.Web.Models;

namespace WeaponGuid.Web.GraphQL;

public sealed record CatalogSpecGraphQlDto(string Name, string Value);

public sealed record CatalogItemGraphQlDto(
    string Id,
    string Name,
    string Country,
    int CountryCode,
    string CategoryCode,
    string Category,
    int Position,
    string Kind,
    string ImageUrl,
    IReadOnlyList<CatalogSpecGraphQlDto> Specs,
    string Description)
{
    public static CatalogItemGraphQlDto FromCatalogItem(CatalogItem item) =>
        new(
            item.Id,
            item.Name,
            item.Country,
            item.CountryCode,
            item.CategoryCode,
            item.Category,
            item.Position,
            item.Kind,
            item.ImageUrl,
            item.Specs.Select(spec => new CatalogSpecGraphQlDto(spec.Key, spec.Value)).ToArray(),
            item.Description);
}
