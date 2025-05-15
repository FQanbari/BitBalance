using BitBalance.Domain.ValueObjects;

namespace BitBalance.Application.Interfaces;

public interface ICryptoPriceProvider
{
    Task<Money> GetPriceAsync(CoinSymbol symbol);
}