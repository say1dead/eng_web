using System.Text.Json;
using WeaponGuid.Web.Models;

namespace WeaponGuid.Web.Services;

public sealed class JsonCatalogSource(IWebHostEnvironment environment, ImageUrlBuilder imageUrlBuilder)
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public async Task<IReadOnlyList<CatalogItem>> LoadAsync(CancellationToken cancellationToken = default)
    {
        var items = new List<CatalogItem>();

        await LoadFileAsync(items, "weapons.json", cancellationToken);
        await LoadFileAsync(items, "wheel_auto.json", cancellationToken);
        await LoadFileAsync(items, "fly_auto.json", cancellationToken);

        return items
            .GroupBy(item => item.Id)
            .Select(group => group.First())
            .OrderBy(item => item.CountryCode)
            .ThenBy(item => item.CategoryCode)
            .ThenBy(item => item.Position)
            .ToArray();
    }

    private async Task LoadFileAsync(List<CatalogItem> output, string fileName, CancellationToken cancellationToken)
    {
        var path = ResolveDataFile(fileName);
        await using var stream = File.OpenRead(path);
        var rawItems = await JsonSerializer.DeserializeAsync<RawCatalogItem[]>(stream, JsonOptions, cancellationToken)
                       ?? [];

        foreach (var raw in rawItems)
        {
            var item = Convert(raw);
            if (item is not null)
            {
                output.Add(item);
            }
        }
    }

    private string ResolveDataFile(string fileName)
    {
        var candidates = new[]
        {
            Path.Combine(environment.ContentRootPath, "Data", fileName),
            Path.GetFullPath(Path.Combine(environment.ContentRootPath, "..", fileName)),
            Path.Combine(AppContext.BaseDirectory, "Data", fileName)
        };

        return candidates.FirstOrDefault(File.Exists)
               ?? throw new FileNotFoundException($"Не найден файл данных {fileName}.", fileName);
    }

    private CatalogItem? Convert(RawCatalogItem raw)
    {
        if (raw.Id.Length < 2 || !int.TryParse(raw.Id[..1], out var countryCode))
        {
            return null;
        }

        var categoryCode = raw.Id.Substring(1, 1);
        var position = int.TryParse(raw.Id[2..], out var parsedPosition) ? parsedPosition : 0;
        var category = CatalogMetadata.GetCategory(categoryCode);
        var specs = new Dictionary<string, string>();
        var description = "";

        foreach (var (key, value) in raw.Extra)
        {
            if (key is "id" or "name" or "country")
            {
                continue;
            }

            var cleaned = TextRepair.Clean(value?.ToString());
            if (key == "description")
            {
                description = cleaned;
            }
            else if (!string.IsNullOrWhiteSpace(cleaned))
            {
                var label = CatalogMetadata.SpecLabels.TryGetValue(key, out var mappedLabel) ? mappedLabel : key;
                specs[label] = cleaned;
            }
        }

        var country = TextRepair.Clean(raw.Country);
        if (string.IsNullOrWhiteSpace(country) || country.Contains('Р', StringComparison.Ordinal))
        {
            country = CatalogMetadata.GetCountryName(countryCode);
        }

        return new CatalogItem(
            raw.Id,
            TextRepair.Clean(raw.Name),
            country,
            countryCode,
            categoryCode,
            category.Name,
            position,
            category.Kind,
            imageUrlBuilder.Build(raw.Id),
            specs,
            description);
    }
}
