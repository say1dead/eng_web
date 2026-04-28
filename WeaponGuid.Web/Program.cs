using System.Text;
using Microsoft.Extensions.FileProviders;
using Npgsql;
using WeaponGuid.Web.GraphQL;
using WeaponGuid.Web.Models;
using WeaponGuid.Web.Services;

Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

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
}
else
{
    builder.Services.AddSingleton(_ => NpgsqlDataSource.Create(postgresConnection));
    builder.Services.AddSingleton<ICatalogStore, PostgresCatalogStore>();
}

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
});

var app = builder.Build();
var catalog = app.Services.GetRequiredService<ICatalogStore>();
await catalog.InitializeAsync();

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors();
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "WeaponGuid API v1");
});

var localImagesPath = builder.Configuration["S3:LocalImagesPath"];
if (!string.IsNullOrWhiteSpace(localImagesPath))
{
        var absoluteImagesPath = System.IO.Path.GetFullPath(
            System.IO.Path.Combine(app.Environment.ContentRootPath, localImagesPath));
    if (Directory.Exists(absoluteImagesPath))
    {
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(absoluteImagesPath),
            RequestPath = "/images",
            OnPrepareResponse = context =>
            {
                context.Context.Response.Headers.CacheControl = "public,max-age=604800,immutable";
            }
        });
    }
}

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
    storage = string.IsNullOrWhiteSpace(postgresConnection) ? "json" : "postgres"
}))
    .WithName("GetHealth");

app.MapGraphQL("/graphql");

app.MapFallbackToFile("index.html");

app.Run();
