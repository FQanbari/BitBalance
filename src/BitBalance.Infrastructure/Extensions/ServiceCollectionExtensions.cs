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

namespace BitBalance.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {


        services.Configure<CryptoProvidersOptions>(configuration.GetSection("CryptoProviders"));
        services.Configure<PriceUpdaterOptions>(configuration.GetSection("PriceUpdater"));


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
            var options = sp.GetRequiredService<IOptions<CryptoProvidersOptions>>().Value;
            var cache = sp.GetRequiredService<IMemoryCache>();
            var snapshotRepo = sp.GetRequiredService<IPriceSnapshotRepository>();
            var unitOfWork = sp.GetRequiredService<IUnitOfWork>();
            var tracker = sp.GetRequiredService<ITrackedSymbolService>();

            var binance = new BinancePriceProvider(httpClient, notifier, Options.Create(options.CoinGecko));
            var coinGecko = new CoinGeckoPriceProvider(httpClient, notifier, Options.Create(options.CoinGecko));
            var coinCap = new CoinCapPriceProvider(httpClient, notifier, Options.Create(options.CoinGecko));
            var compare = new CryptoComparePriceProvider(httpClient, notifier,Options.Create(options.CryptoCompare));
            var nomics = new NomicsPriceProvider(httpClient, notifier, Options.Create(options.Nomics));
            
            var chain = new PollyWrappedProvider(binance);
            chain.SetNext(new PollyWrappedProvider(coinGecko))
                 .SetNext(new PollyWrappedProvider(coinCap))
                 .SetNext(new PollyWrappedProvider(compare))
                 .SetNext(new PollyWrappedProvider(nomics));
            
            var cachedChain = new CachedPriceProviderDecorator(chain, cache, TimeSpan.FromMinutes(5));
            var savingDecorator = new PriceSnapshotSavingDecorator(cachedChain, snapshotRepo, unitOfWork, tracker);

            return savingDecorator;
        });

        return services;
    }
    public async static Task<IApplicationBuilder> UseInfrastructure(this IApplicationBuilder app)
    {
        using (var scope = app.ApplicationServices.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<BitBalanceDbContext>();
            await DbInitializer.SeedAsync(db);
        }
    
        return app;
    }
}