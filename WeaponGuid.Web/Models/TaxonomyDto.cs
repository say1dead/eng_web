namespace WeaponGuid.Web.Models;

public sealed record TaxonomyDto(
    IReadOnlyList<CountryDto> Countries,
    IReadOnlyList<CategoryDto> Categories);

public sealed record CountryDto(int Code, string Name);

public sealed record CategoryDto(string Code, string Name, string Kind);
