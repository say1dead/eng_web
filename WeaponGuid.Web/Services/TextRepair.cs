using System.Text;

namespace WeaponGuid.Web.Services;

public static class TextRepair
{
    private static readonly Encoding Windows1251 = Encoding.GetEncoding(1251);

    public static string Clean(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return "";
        }

        var text = value.Trim();
        if (!LooksBroken(text))
        {
            return text;
        }

        try
        {
            var decoded = Encoding.UTF8.GetString(Windows1251.GetBytes(text));
            return Score(decoded) >= Score(text) ? decoded.Trim() : text;
        }
        catch
        {
            return text;
        }
    }

    private static bool LooksBroken(string value) =>
        value.Contains('Р') || value.Contains("РІР‚", StringComparison.Ordinal);

    private static int Score(string value)
    {
        var score = 0;
        foreach (var ch in value)
        {
            if (ch is >= 'А' and <= 'я' or 'Ё' or 'ё')
            {
                score += 3;
            }
            else if ("РЎГђГ‘РІР‚".Contains(ch, StringComparison.Ordinal))
            {
                score -= 2;
            }
            else if (char.IsLetterOrDigit(ch) || char.IsWhiteSpace(ch))
            {
                score++;
            }
        }

        return score;
    }
}
