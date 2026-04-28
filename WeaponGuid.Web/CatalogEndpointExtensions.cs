using WeaponGuid.Web.Models;
using WeaponGuid.Web.Services;

namespace WeaponGuid.Web;

public static class CatalogEndpointExtensions
{
    public static IEndpointRouteBuilder MapCatalogEndpoints(this IEndpointRouteBuilder app, string storageKind)
    {
        app.MapGet("/api/taxonomy", () =>
            Results.Ok(new TaxonomyDto(CatalogMetadata.Countries, CatalogMetadata.Categories)))
            .WithName("GetTaxonomy");

        app.MapGet("/api/items", async (
            string? country,
            string? category,
            string? q,
            ICatalogStore store,
            CancellationToken cancellationToken) =>
        {
            var items = await store.ListAsync(new CatalogFilters(country, category, q), cancellationToken);
            return Results.Ok(items);
        })
            .WithName("GetItems");

        app.MapGet("/api/items/{id}", async (string id, ICatalogStore store, CancellationToken cancellationToken) =>
        {
            var item = await store.GetAsync(id, cancellationToken);
            return item is null ? Results.NotFound() : Results.Ok(item);
        })
            .WithName("GetItemById");

        app.MapGet("/api/health", () => Results.Ok(new
        {
            status = "ok",
            storage = storageKind
        }))
            .WithName("GetHealth");

        return app;
    }
}
