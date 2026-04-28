using Microsoft.Extensions.FileProviders;

namespace WeaponGuid.Web.Infrastructure;

public static class StaticFileExtensions
{
    public static IApplicationBuilder UseLocalCatalogImages(this WebApplication app)
    {
        var localImagesPath = app.Configuration["S3:LocalImagesPath"];
        if (string.IsNullOrWhiteSpace(localImagesPath))
        {
            return app;
        }

        var absoluteImagesPath = System.IO.Path.GetFullPath(
            System.IO.Path.Combine(app.Environment.ContentRootPath, localImagesPath));
        if (!Directory.Exists(absoluteImagesPath))
        {
            return app;
        }

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(absoluteImagesPath),
            RequestPath = "/images",
            OnPrepareResponse = context =>
            {
                context.Context.Response.Headers.CacheControl = "public,max-age=604800,immutable";
            }
        });

        return app;
    }
}
