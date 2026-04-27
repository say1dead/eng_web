using System.Text;
using Microsoft.Extensions.FileProviders;
using Npgsql;
using WeaponGuid.Web.Models;
using WeaponGuid.Web.Services;

Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Services.AddSingleton<ImageUrlBuilder>();
builder.Services.AddSingleton<JsonCatalogSource>();

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

var localImagesPath = builder.Configuration["S3:LocalImagesPath"];
if (!string.IsNullOrWhiteSpace(localImagesPath))
{
    var absoluteImagesPath = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, localImagesPath));
    if (Directory.Exists(absoluteImagesPath))
    {
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(absoluteImagesPath),
            RequestPath = "/images"
        });
    }
}

app.MapGet("/api/taxonomy", () =>
    Results.Ok(new TaxonomyDto(CatalogMetadata.Countries, CatalogMetadata.Categories)));

app.MapGet("/api/items", async (
    string? country,
    string? category,
    string? q,
    ICatalogStore store,
    CancellationToken cancellationToken) =>
{
    var items = await store.ListAsync(new CatalogFilters(country, category, q), cancellationToken);
    return Results.Ok(items);
});

app.MapGet("/api/items/{id}", async (string id, ICatalogStore store, CancellationToken cancellationToken) =>
{
    var item = await store.GetAsync(id, cancellationToken);
    return item is null ? Results.NotFound() : Results.Ok(item);
});

app.MapGet("/api/health", () => Results.Ok(new
{
    status = "ok",
    storage = string.IsNullOrWhiteSpace(postgresConnection) ? "json" : "postgres"
}));

app.MapFallbackToFile("index.html");

app.Run();
