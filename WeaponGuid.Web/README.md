# WeaponGuid.Web

Веб-версия справочника. Бэкенд написан на ASP.NET Core/C#, метаданные можно держать в PostgreSQL, картинки рассчитаны на S3-совместимое хранилище.

## Быстрый запуск без PostgreSQL

```powershell
$env:DOTNET_CLI_HOME="h:\eng_proj\WeaponGuid\.dotnet-home"
dotnet run --project WeaponGuid.Web --urls http://localhost:5137
```

В этом режиме API читает старые `weapons.json`, `wheel_auto.json`, `fly_auto.json`, а картинки берет из `../data` по адресу `/images/{id}.jpg`.

## Запуск с PostgreSQL

Укажи строку подключения:

```powershell
$env:ConnectionStrings__Postgres="Host=localhost;Port=5432;Database=weaponguid;Username=postgres;Password=postgres"
dotnet run --project WeaponGuid.Web --urls http://localhost:5137
```

При первом запуске приложение само создаст таблицу `catalog_items` и импортирует данные из JSON.

## S3

Если картинки публичные:

```powershell
$env:S3__PublicBaseUrl="https://s3.example.com/weaponguid"
$env:S3__ObjectKeyTemplate="{id}.jpg"
dotnet run --project WeaponGuid.Web --urls http://localhost:5137
```

Если картинки лежат в префиксе, например `images/1102.jpg`, поставь:

```powershell
$env:S3__ObjectKeyTemplate="images/{id}.jpg"
```

## API

- `GET /api/taxonomy` - страны и категории.
- `GET /api/items?country=1&category=4&q=т-34` - список карточек.
- `GET /api/items/1102` - одна карточка.
- `GET /api/health` - проверка живости и активного хранилища.
