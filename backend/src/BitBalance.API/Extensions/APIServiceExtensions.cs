using BitBalance.API.Filters;
using Microsoft.AspNetCore.Http;
using System;
using BitBalance.API.Services;
using BitBalance.Infrastructure.Persistence;
using Serilog;
using System.Text.Json.Serialization;
using System.Text.Json;

namespace BitBalance.API.Extensions;

public static class APIServiceExtensions
{
    public static void AddAPIService(this WebApplicationBuilder builder)
    {
        //services.AddSwaggerDocumentation();
        
        builder.Services.AddScoped<RequestLoggingFilter>();

        builder.Services.AddHostedService<PriceUpdaterService>();
        var allowedOrigins = builder.Configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigin", policy =>
            {
                policy.WithOrigins(allowedOrigins)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });

        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase, allowIntegerValues: false));
            });

    }

}
public static class SerilogExtensions
{
    public static void ConfigureSerilog(this WebApplicationBuilder builder)
    {
        // Initial logger to capture errors during app startup
        Log.Logger = new LoggerConfiguration()
            .ReadFrom.Configuration(builder.Configuration)
            .CreateLogger();

        builder.Host.UseSerilog((context, services, configuration) =>
        {
            configuration
                .ReadFrom.Configuration(context.Configuration)
                .WriteTo.Console()
                .WriteTo.Fluentd(
                    host: context.Configuration["Logging:Fluentd:Host"],
                    port: int.Parse(context.Configuration["Logging:Fluentd:Port"] ?? "24224"),
                    tag: context.Configuration["Logging:Fluentd:Tag"] ?? "aspnet"
                );
        });
    }
}