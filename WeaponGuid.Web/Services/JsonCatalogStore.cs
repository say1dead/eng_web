using WeaponGuid.Web.Models;

namespace WeaponGuid.Web.Services;

public sealed class JsonCatalogStore(JsonCatalogSource source) : ICatalogStore
{
    private IReadOnlyList<CatalogItem>? items;

    public async Task InitializeAsync(CancellationToken cancellationToken = default)
    {
        items ??= await source.LoadAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<CatalogItem>> ListAsync(CatalogFilters filters, CancellationToken cancellationToken = default)
    {
        await InitializeAsync(cancellationToken);
        var query = items!.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(filters.Country))
        {
            query = query.Where(item => item.CountryCode.ToString() == filters.Country);
        }

        if (!string.IsNullOrWhiteSpace(filters.Category))
        {
            query = query.Where(item => item.CategoryCode == filters.Category);
        }

        if (!string.IsNullOrWhiteSpace(filters.Query))
        {
            var search = filters.Query.Trim();
            query = query.Where(item =>
                item.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                item.Country.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                item.Category.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                item.Description.Contains(search, StringComparison.OrdinalIgnoreCase));
        }

        return query.ToArray();
    }

    public async Task<CatalogItem?> GetAsync(string id, CancellationToken cancellationToken = default)
    {
        await InitializeAsync(cancellationToken);
        return items!.FirstOrDefault(item => item.Id == id);
    }
}
