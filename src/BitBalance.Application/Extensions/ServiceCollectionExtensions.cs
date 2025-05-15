using BitBalance.Domain.Services;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace BitBalance.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        // services.AddAutoMapper(Assembly.GetExecutingAssembly());

        services.AddScoped<AlertEvaluator>();
        // services.AddScoped<IExampleService, ExampleService>();

        return services;
    }
}
