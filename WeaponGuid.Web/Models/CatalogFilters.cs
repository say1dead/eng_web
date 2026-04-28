namespace WeaponGuid.Web.Models;

public sealed record CatalogFilters(
    string? Country,
    string? Category,
    string? Query);
