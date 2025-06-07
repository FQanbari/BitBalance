using BitBalance.Domain.ValueObjects;

namespace BitBalance.Application.Interfaces;
public interface ICryptoPriceProvider
{
    Task<Money?> TryGetPriceAsync(CoinSymbol symbol);
    ICryptoPriceProvider? SetNext(ICryptoPriceProvider next);
}
