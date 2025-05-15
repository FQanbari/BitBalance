using BitBalance.Application.Interfaces;
using BitBalance.Domain.Interfaces;
using BitBalance.Infrastructure.External.CoinGecko;
using BitBalance.Infrastructure.Persistence.Repositories;
using BitBalance.Infrastructure.Persistence;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using BitBalance.Infrastructure.Notifiers;

namespace BitBalance.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<BitBalanceDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
        services.Configure<CoinGeckoOptions>(configuration.GetSection("CryptoProviders:CoinGecko"));

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IPortfolioRepository, PortfolioRepository>();
        services.AddHttpClient<ICryptoPriceProvider, CoinGeckoPriceProvider>();

        services.AddScoped<IAlertNotifier, EmailNotifier>();
        // services.AddScoped<IAlertNotifier, TelegramNotifier>();

        return services;
    }
}