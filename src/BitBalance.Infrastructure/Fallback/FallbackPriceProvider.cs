using BitBalance.Application.Interfaces;
using BitBalance.Domain.ValueObjects;
using Microsoft.Extensions.Logging;

namespace BitBalance.Infrastructure.Fallback;

public class FallbackPriceProvider : ICryptoPriceProvider
{
    private readonly IEnumerable<ICryptoPriceProvider> _providers;
    private readonly ILogger<FallbackPriceProvider> _logger;

    public FallbackPriceProvider(IEnumerable<ICryptoPriceProvider> providers)
    {
        _providers = providers;
    }

    public async Task<Money> GetPriceAsync(CoinSymbol symbol)
    {
        foreach (var provider in _providers)
        {
            try
            {
                return await provider.GetPriceAsync(symbol);
            }
            catch
            {

            }
        }

        throw new ApplicationException($"Price for {symbol.Symbol} not found in any provider.");
    }
}
