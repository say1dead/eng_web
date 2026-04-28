using Npgsql;
using WeaponGuid.Web.GraphQL;
using WeaponGuid.Web.Services;

namespace WeaponGuid.Web;

public static class CatalogServiceExtensions
{
    public static string AddCatalogServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddSingleton<ImageUrlBuilder>();
        builder.Services.AddSingleton<JsonCatalogSource>();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services
            .AddGraphQLServer()
            .AddQueryType<CatalogQuery>();

        var postgresConnection = builder.Configuration.GetConnectionString("Postgres");
        if (string.IsNullOrWhiteSpace(postgresConnection))
        {
            builder.Services.AddSingleton<ICatalogStore, JsonCatalogStore>();
            return "json";
        }

        builder.Services.AddSingleton(_ => NpgsqlDataSource.Create(postgresConnection));
        builder.Services.AddSingleton<ICatalogStore, PostgresCatalogStore>();
        return "postgres";
    }

    public static async Task InitializeCatalogAsync(this WebApplication app)
    {
        var catalog = app.Services.GetRequiredService<ICatalogStore>();
        await catalog.InitializeAsync();
    }
}
