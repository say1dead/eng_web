namespace WeaponGuid.Web.Infrastructure;

public static class CorsExtensions
{
    public static IServiceCollection AddAppCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
        });

        return services;
    }
}
