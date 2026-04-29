using System.Globalization;
using System.Text;
using WeaponGuid.Web.Models;

namespace WeaponGuid.Web.Services;

public static class SearchText
{
    private static readonly IReadOnlyDictionary<char, string> CyrillicToLatin = new Dictionary<char, string>
    {
        ['а'] = "a",
        ['б'] = "b",
        ['в'] = "v",
        ['г'] = "g",
        ['д'] = "d",
        ['е'] = "e",
        ['ё'] = "e",
        ['ж'] = "zh",
        ['з'] = "z",
        ['и'] = "i",
        ['й'] = "i",
        ['к'] = "k",
        ['л'] = "l",
        ['м'] = "m",
        ['н'] = "n",
        ['о'] = "o",
        ['п'] = "p",
        ['р'] = "r",
        ['с'] = "s",
        ['т'] = "t",
        ['у'] = "u",
        ['ф'] = "f",
        ['х'] = "h",
        ['ц'] = "ts",
        ['ч'] = "ch",
        ['ш'] = "sh",
        ['щ'] = "sch",
        ['ъ'] = "",
        ['ы'] = "y",
        ['ь'] = "",
        ['э'] = "e",
        ['ю'] = "yu",
        ['я'] = "ya"
    };

    public static bool Matches(CatalogItem item, string query)
    {
        var needle = Normalize(query);
        if (needle.Length == 0)
        {
            return true;
        }

        return BuildIndex(item).Contains(needle, StringComparison.Ordinal);
    }

    public static string BuildIndex(CatalogItem item) =>
        Normalize(string.Join(' ', new[]
        {
            item.Id,
            item.Name,
            item.Country,
            item.Category,
            item.Description
        }.Concat(item.Specs.Values)));

    public static string Normalize(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return "";
        }

        var builder = new StringBuilder(value.Length);
        foreach (var rune in value.Trim().ToLowerInvariant().Normalize(NormalizationForm.FormD))
        {
            if (CharUnicodeInfo.GetUnicodeCategory(rune) == UnicodeCategory.NonSpacingMark)
            {
                continue;
            }

            if (CyrillicToLatin.TryGetValue(rune, out var mapped))
            {
                builder.Append(mapped);
            }
            else if (rune is >= 'a' and <= 'z' or >= '0' and <= '9')
            {
                builder.Append(rune);
            }
        }

        return builder.ToString();
    }
}
