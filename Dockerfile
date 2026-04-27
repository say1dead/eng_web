FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY WeaponGuid.sln ./
COPY WeaponGuid.Web/WeaponGuid.Web.csproj WeaponGuid.Web/
RUN dotnet restore WeaponGuid.Web/WeaponGuid.Web.csproj

COPY . .
RUN dotnet publish WeaponGuid.Web/WeaponGuid.Web.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

COPY --from=build /app/publish ./
COPY data/ /data/

ENTRYPOINT ["dotnet", "WeaponGuid.Web.dll"]
