using BitBalance.API.Filters;

namespace BitBalance.API.Extensions;

public static class APIServiceExtensions
{
    public static IServiceCollection AddAPIService(this IServiceCollection services)
    {
        services.AddSwaggerDocumentation();
        services.AddScoped<RequestLoggingFilter>();

        return services;
    }

    public static IApplicationBuilder UseAPIService(this IApplicationBuilder app)
    {
        app.UseSwaggerDocumentation();

        return app;
    }
}