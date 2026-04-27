namespace WeaponGuid.Web.Services;

public sealed class ImageUrlBuilder(IConfiguration configuration)
{
    public string Build(string id)
    {
        var keyTemplate = configuration["S3:ObjectKeyTemplate"];
        var key = string.IsNullOrWhiteSpace(keyTemplate)
            ? $"{id}.jpg"
            : keyTemplate.Replace("{id}", id, StringComparison.OrdinalIgnoreCase);

        var publicBaseUrl = configuration["S3:PublicBaseUrl"];
        if (string.IsNullOrWhiteSpace(publicBaseUrl))
        {
            return $"/images/{key.TrimStart('/')}";
        }

        return $"{publicBaseUrl.TrimEnd('/')}/{key.TrimStart('/')}";
    }
}
