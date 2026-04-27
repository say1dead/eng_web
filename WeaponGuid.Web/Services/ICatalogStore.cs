using WeaponGuid.Web.Models;

namespace WeaponGuid.Web.Services;

public interface ICatalogStore
{
    Task InitializeAsync(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<CatalogItem>> ListAsync(CatalogFilters filters, CancellationToken cancellationToken = default);

    Task<CatalogItem?> GetAsync(string id, CancellationToken cancellationToken = default);
}
