using BitBalance.Application.Interfaces;
using BitBalance.Domain.Interfaces;
using BitBalance.Domain.ValueObjects;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Concurrent;

namespace BitBalance.Infrastructure.External;

public class TrackedSymbolService : ITrackedSymbolService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ConcurrentDictionary<string, CoinSymbol> _trackedSymbols = new();

    public TrackedSymbolService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public void Track(CoinSymbol symbol)
    {
        _trackedSymbols.TryAdd(symbol.Symbol, symbol);
    }

    public IReadOnlyCollection<CoinSymbol> GetTrackedSymbols()
    {
        if (_trackedSymbols.IsEmpty)
        {
            using var scope = _serviceProvider.CreateScope();
            var repository = scope.ServiceProvider.GetRequiredService<IPriceSnapshotRepository>();

            var symbols = repository.GetAllCoinSymbols().Result; 

            foreach (var symbol in symbols)
                Track(symbol);
        }

        return _trackedSymbols.Values.ToList();
    }
}

