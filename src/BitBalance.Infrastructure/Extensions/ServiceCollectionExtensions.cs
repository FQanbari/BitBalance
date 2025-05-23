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
using BitBalance.Infrastructure.Fallback;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace BitBalance.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {


        services.Configure<CryptoProvidersOptions>(configuration.GetSection("CryptoProviders"));

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IPortfolioRepository, PortfolioRepository>();
        services.AddScoped<IPriceSnapshotRepository, PriceSnapshotRepository>();
        //services.AddHttpClient<ICryptoPriceProvider, CoinGeckoPriceProvider>();

        services.AddScoped<IAlertNotifier, EmailNotifier>();
        // services.AddScoped<IAlertNotifier, TelegramNotifier>();

        services.AddMemoryCache();
        services.AddHttpClient();

        services.AddScoped<ICryptoPriceProvider>(sp =>
        {
            var httpClient = sp.GetRequiredService<IHttpClientFactory>().CreateClient();
            var options = sp.GetRequiredService<IOptions<CryptoProvidersOptions>>().Value;

            var cache = sp.GetRequiredService<IMemoryCache>();
            var priceSnapshotRepo = sp.GetRequiredService<IPriceSnapshotRepository>();
            var unitOfWork = sp.GetRequiredService<IUnitOfWork>();

            var coinGeckoProvider = new CoinGeckoPriceProvider(httpClient, Options.Create(options.CoinGecko));
            var binanceProvider = new BinancePriceProvider(httpClient, Options.Create(options.Binance));
            var cryptoCompareProvider = new CryptoComparePriceProvider(httpClient, Options.Create(options.CryptoCompare));
            var coinCapProvider = new CoinCapPriceProvider(httpClient, Options.Create(options.CoinCap));
            var nomicsProvider = new NomicsPriceProvider(httpClient, Options.Create(options.Nomics));

            var cachedCoinGecko = new CachedPriceProviderDecorator(coinGeckoProvider, cache, TimeSpan.FromMinutes(5));
            var cachedBinance = new CachedPriceProviderDecorator(binanceProvider, cache, TimeSpan.FromMinutes(5));
            var cachedCryptoCompare = new CachedPriceProviderDecorator(cryptoCompareProvider, cache, TimeSpan.FromMinutes(5));
            var cachedCoinCap = new CachedPriceProviderDecorator(coinCapProvider, cache, TimeSpan.FromMinutes(5));
            var cachedNomics = new CachedPriceProviderDecorator(nomicsProvider, cache, TimeSpan.FromMinutes(5));

            var fallbackProvider = new FallbackPriceProvider(new ICryptoPriceProvider[]
            {
        cachedCoinGecko,
        cachedBinance,
        cachedCryptoCompare,
        cachedCoinCap,
        cachedNomics
            });

            var savingDecorator = new PriceSnapshotSavingDecorator(fallbackProvider, priceSnapshotRepo, unitOfWork);

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