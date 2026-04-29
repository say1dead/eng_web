using System.Text.Json;
using Npgsql;
using WeaponGuid.Web.Models;

namespace WeaponGuid.Web.Services;

public sealed class PostgresCatalogStore(NpgsqlDataSource dataSource, JsonCatalogSource source) : ICatalogStore
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task InitializeAsync(CancellationToken cancellationToken = default)
    {
        await using var connection = await dataSource.OpenConnectionAsync(cancellationToken);
        await EnsureSchemaAsync(connection, cancellationToken);

        if (await HasRowsAsync(connection, cancellationToken))
        {
            return;
        }

        var items = await source.LoadAsync(cancellationToken);
        foreach (var item in items)
        {
            await InsertAsync(connection, item, cancellationToken);
        }
    }

    public async Task<IReadOnlyList<CatalogItem>> ListAsync(CatalogFilters filters, CancellationToken cancellationToken = default)
    {
        await using var connection = await dataSource.OpenConnectionAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        var conditions = new List<string>();

        if (!string.IsNullOrWhiteSpace(filters.Country))
        {
            conditions.Add("country_code = @country_code");
            command.Parameters.AddWithValue("country_code", int.Parse(filters.Country));
        }

        if (!string.IsNullOrWhiteSpace(filters.Category))
        {
            conditions.Add("category_code = @category_code");
            command.Parameters.AddWithValue("category_code", filters.Category);
        }

        command.CommandText = $"""
            select id, name, country, country_code, category_code, category, position, kind, image_url, specs::text, description
            from catalog_items
            {(conditions.Count == 0 ? "" : "where " + string.Join(" and ", conditions))}
            order by country_code, category_code, position;
            """;

        var result = new List<CatalogItem>();
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            result.Add(ReadItem(reader));
        }

        if (!string.IsNullOrWhiteSpace(filters.Query))
        {
            result = result.Where(item => SearchText.Matches(item, filters.Query)).ToList();
        }

        return result;
    }

    public async Task<CatalogItem?> GetAsync(string id, CancellationToken cancellationToken = default)
    {
        await using var connection = await dataSource.OpenConnectionAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText = """
            select id, name, country, country_code, category_code, category, position, kind, image_url, specs::text, description
            from catalog_items
            where id = @id;
            """;
        command.Parameters.AddWithValue("id", id);

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        return await reader.ReadAsync(cancellationToken) ? ReadItem(reader) : null;
    }

    private static async Task EnsureSchemaAsync(NpgsqlConnection connection, CancellationToken cancellationToken)
    {
        await using var schema = connection.CreateCommand();
        schema.CommandText = """
            create table if not exists catalog_items (
                id text primary key,
                name text not null,
                country text not null,
                country_code int not null,
                category_code text not null,
                category text not null,
                position int not null,
                kind text not null,
                image_url text not null,
                specs jsonb not null,
                description text not null
            );

            create index if not exists ix_catalog_country_category
                on catalog_items (country_code, category_code, position);
            """;
        await schema.ExecuteNonQueryAsync(cancellationToken);
    }

    private static async Task<bool> HasRowsAsync(NpgsqlConnection connection, CancellationToken cancellationToken)
    {
        await using var countCommand = connection.CreateCommand();
        countCommand.CommandText = "select count(*) from catalog_items;";
        var count = (long)(await countCommand.ExecuteScalarAsync(cancellationToken) ?? 0L);
        return count > 0;
    }

    private static async Task InsertAsync(NpgsqlConnection connection, CatalogItem item, CancellationToken cancellationToken)
    {
        await using var insert = connection.CreateCommand();
        insert.CommandText = """
            insert into catalog_items
            (id, name, country, country_code, category_code, category, position, kind, image_url, specs, description)
            values
            (@id, @name, @country, @country_code, @category_code, @category, @position, @kind, @image_url, cast(@specs as jsonb), @description)
            on conflict (id) do nothing;
            """;
        insert.Parameters.AddWithValue("id", item.Id);
        insert.Parameters.AddWithValue("name", item.Name);
        insert.Parameters.AddWithValue("country", item.Country);
        insert.Parameters.AddWithValue("country_code", item.CountryCode);
        insert.Parameters.AddWithValue("category_code", item.CategoryCode);
        insert.Parameters.AddWithValue("category", item.Category);
        insert.Parameters.AddWithValue("position", item.Position);
        insert.Parameters.AddWithValue("kind", item.Kind);
        insert.Parameters.AddWithValue("image_url", item.ImageUrl);
        insert.Parameters.AddWithValue("specs", JsonSerializer.Serialize(item.Specs, JsonOptions));
        insert.Parameters.AddWithValue("description", item.Description);
        await insert.ExecuteNonQueryAsync(cancellationToken);
    }

    private static CatalogItem ReadItem(NpgsqlDataReader reader)
    {
        var specs = JsonSerializer.Deserialize<Dictionary<string, string>>(reader.GetString(9), JsonOptions)
                    ?? new Dictionary<string, string>();

        return new CatalogItem(
            reader.GetString(0),
            reader.GetString(1),
            reader.GetString(2),
            reader.GetInt32(3),
            reader.GetString(4),
            reader.GetString(5),
            reader.GetInt32(6),
            reader.GetString(7),
            reader.GetString(8),
            specs,
            reader.GetString(10));
    }
}
