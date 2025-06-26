using BitBalance.Application.Interfaces;
using BitBalance.Domain.ValueObjects;
using System.Collections.Concurrent;

namespace BitBalance.Infrastructure.External;

public class TrackedSymbolService : ITrackedSymbolService
{
    private readonly ConcurrentDictionary<string, CoinSymbol> _trackedSymbols = new();

    public void Track(CoinSymbol symbol)
    {
        _trackedSymbols.TryAdd(symbol.Symbol, symbol);
    }

    public IReadOnlyCollection<CoinSymbol> GetTrackedSymbols()
    {
        return _trackedSymbols.Values.ToList();
    }
}
