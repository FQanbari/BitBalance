using BitBalance.Domain.ValueObjects;

namespace BitBalance.Application.Interfaces;

public interface ITrackedSymbolService
{
    void Track(CoinSymbol symbol);
    IReadOnlyCollection<CoinSymbol> GetTrackedSymbols();
}
