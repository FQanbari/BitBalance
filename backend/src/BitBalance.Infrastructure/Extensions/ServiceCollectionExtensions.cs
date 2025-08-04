using BitBalance.Application.Interfaces;
using BitBalance.Domain.Interfaces;
using BitBalance.Infrastructure.External.CoinGecko;
using BitBalance.Infrastructure.Persistence.Repositories;
using BitBalance.Infrastructure.Persistence;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using BitBalance.Infrastructure.Notifiers;
using Microsoft.AspNetCore.Builder;
using BitBalance.Infrastructure.Caching;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using BitBalance.Infrastructure.SignalR;
using BitBalance.Infrastructure.External;
using BitBalance.Domain.ValueObjects;
using Polly;

namespace BitBalance.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {

        services.AddBitBalanceDbContext(configuration);
        services.Configure<CryptoProvidersOptions>(configuration.GetSection("CryptoProviders"));
        services.Configure<PriceUpdaterOptions>(configuration.GetSection("PriceUpdater"));
        services.Configure<PriceFetcherOptions>(configuration.GetSection("PriceFetcherOptions"));


        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IPortfolioRepository, PortfolioRepository>();
        services.AddScoped<IPriceSnapshotRepository, PriceSnapshotRepository>();
        services.AddScoped<IUserSettingsRepository, UserSettingsRepository>();
        services.AddSingleton<ITrackedSymbolService, TrackedSymbolService>();
        services.AddSingleton<IPriceBroadcaster, PriceBroadcaster>();

        //services.AddHttpClient<ICryptoPriceProvider, CoinGeckoPriceProvider>();

        services.AddScoped<IAlertNotifier, EmailNotifier>();
        // services.AddScoped<IAlertNotifier, TelegramNotifier>();

        services.AddMemoryCache();
        services.AddHttpClient();
        services.AddSignalR();
        services.AddSingleton<PriceBroadcaster>();
       
        services.AddScoped<ICryptoPriceProvider>(sp =>
        {
            var notifier = sp.GetRequiredService<PriceBroadcaster>();
            var httpClient = sp.GetRequiredService<IHttpClientFactory>().CreateClient();
            var cache = sp.GetRequiredService<IMemoryCache>();
            var snapshotRepo = sp.GetRequiredService<IPriceSnapshotRepository>();
            var unitOfWork = sp.GetRequiredService<IUnitOfWork>();
            var tracker = sp.GetRequiredService<ITrackedSymbolService>();
            var pollyOptions = sp.GetRequiredService<IOptions<PriceFetcherOptions>>().Value;

            var options = sp.GetRequiredService<IOptions<CryptoProvidersOptions>>().Value;
            var providerMap = new Dictionary<string, ICryptoPriceProvider>
            {
                ["CoinGecko"] = new CoinGeckoPriceProvider(httpClient, notifier, Options.Create(options.CoinGecko)),
                ["CoinCap"] = new CoinCapPriceProvider(httpClient, notifier, Options.Create(options.CoinGecko)),
                ["Binance"] = new BinancePriceProvider(httpClient, notifier, Options.Create(options.CoinGecko)),
                ["Nomics"] = new NomicsPriceProvider(httpClient, notifier, Options.Create(options.Nomics)),
                ["CryptoCompare"] = new CryptoComparePriceProvider(httpClient, notifier, Options.Create(options.CryptoCompare)),
            };

            ICryptoPriceProvider? chain = null;
            ICryptoPriceProvider? current = null;

            foreach (var name in options.Order)
            {
                var provider = new PollyWrappedProvider(providerMap[name], Options.Create(pollyOptions));
                if (chain == null)
                {
                    chain = provider;
                    current = provider;
                }
                else
                {
                    current = current!.SetNext(provider);
                }
            }

            var cachedChain = new CachedPriceProviderDecorator(chain, cache, TimeSpan.FromMinutes(5));
            var savingDecorator = new PriceSnapshotSavingDecorator(cachedChain, snapshotRepo, unitOfWork, tracker);

            return savingDecorator;
        });

        return services;
    }


    public static IServiceCollection AddBitBalanceDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<BitBalanceDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        return services;
    }

    public static async Task<IApplicationBuilder> SeedBitBalanceDatabaseAsync(this IApplicationBuilder app)
    {
        using (var scope = app.ApplicationServices.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<BitBalanceDbContext>();
            await DbInitializer.SeedAsync(db);
        }

        return app;
    }
}
