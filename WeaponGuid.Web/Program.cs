using System.Text;
using WeaponGuid.Web;
using WeaponGuid.Web.Infrastructure;

Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var storageKind = builder.AddCatalogServices();
builder.Services.AddAppCors();

var app = builder.Build();
await app.InitializeCatalogAsync();

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseLocalCatalogImages();
app.UseCors();
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "WeaponGuid API v1");
});

app.MapCatalogEndpoints(storageKind);
app.MapGraphQL("/graphql");
app.MapFallbackToFile("index.html");

app.Run();
