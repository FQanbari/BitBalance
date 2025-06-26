using BitBalance.Application.Interfaces;
using BitBalance.Domain.Interfaces;
using BitBalance.Infrastructure.External.CoinGecko;
using BitBalance.Infrastructure.SignalR;
using Microsoft.Extensions.Options;

namespace BitBalance.API.Services;

public class _PriceUpdaterService : BackgroundService
{
    private readonly ICryptoPriceProvider _provider;
    private readonly ITrackedSymbolService _tracker;
    private readonly IPriceBroadcaster _broadcaster;
    private readonly PriceUpdaterOptions _options;

    public _PriceUpdaterService(
        ICryptoPriceProvider provider,
        ITrackedSymbolService tracker,
        IPriceBroadcaster broadcaster,
         IOptions<PriceUpdaterOptions> options)
    {
        _provider = provider;
        _tracker = tracker;
        _broadcaster = broadcaster;
        _options = options.Value;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var symbols = _tracker.GetTrackedSymbols().Take(_options.MaxSymbolsToUpdatePerCycle);

            foreach (var symbol in symbols)
            {
                var price = await _provider.TryGetPriceAsync(symbol);
                if (price != null)
                {
                    await _broadcaster.BroadcastPriceAsync(symbol.Symbol, price.Amount);
                }
            }

            await Task.Delay(TimeSpan.FromSeconds(_options.UpdateIntervalSeconds), stoppingToken);
        }
    }
}
public class PriceUpdaterService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public PriceUpdaterService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();

            var provider = scope.ServiceProvider.GetRequiredService<ICryptoPriceProvider>();
            var tracker = scope.ServiceProvider.GetRequiredService<ITrackedSymbolService>();
            var broadcaster = scope.ServiceProvider.GetRequiredService<IPriceBroadcaster>();

            var symbols = tracker.GetTrackedSymbols().Take(10);

            foreach (var symbol in symbols)
            {
                var price = await provider.TryGetPriceAsync(symbol);
                if (price != null)
                {
                    await broadcaster.BroadcastPriceAsync(symbol.Symbol, price.Amount);
                }
            }

            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
        }
    }
}
