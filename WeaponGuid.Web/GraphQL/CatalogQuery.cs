using WeaponGuid.Web.Models;
using WeaponGuid.Web.Services;

namespace WeaponGuid.Web.GraphQL;

public sealed class CatalogQuery
{
    public TaxonomyDto GetTaxonomy() =>
        new(CatalogMetadata.Countries, CatalogMetadata.Categories);

    public async Task<IReadOnlyList<CatalogItemGraphQlDto>> GetItems(
        string? country,
        string? category,
        string? q,
        [Service] ICatalogStore store,
        CancellationToken cancellationToken)
    {
        var items = await store.ListAsync(new CatalogFilters(country, category, q), cancellationToken);
        return items.Select(CatalogItemGraphQlDto.FromCatalogItem).ToArray();
    }

    public async Task<CatalogItemGraphQlDto?> GetItem(
        string id,
        [Service] ICatalogStore store,
        CancellationToken cancellationToken)
    {
        var item = await store.GetAsync(id, cancellationToken);
        return item is null ? null : CatalogItemGraphQlDto.FromCatalogItem(item);
    }
}
