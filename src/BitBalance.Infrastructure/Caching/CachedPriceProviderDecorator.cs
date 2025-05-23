using BitBalance.Application.Interfaces;
using BitBalance.Domain.ValueObjects;
using Microsoft.Extensions.Caching.Memory;

namespace BitBalance.Infrastructure.Caching;

public class CachedPriceProviderDecorator : ICryptoPriceProvider
{
    private readonly ICryptoPriceProvider _inner;
    private readonly IMemoryCache _cache;
    private readonly TimeSpan _cacheDuration;

    public CachedPriceProviderDecorator(ICryptoPriceProvider inner, IMemoryCache cache, TimeSpan cacheDuration)
    {
        _inner = inner;
        _cache = cache;
        _cacheDuration = cacheDuration;
    }

    public async Task<Money> GetPriceAsync(CoinSymbol symbol)
    {
        var cacheKey = $"price_{symbol.Symbol}";
        if (_cache.TryGetValue(cacheKey, out Money cachedPrice))
        {
            return cachedPrice;
        }

        var price = await _inner.GetPriceAsync(symbol);
        _cache.Set(cacheKey, price, _cacheDuration);
        return price;
    }
}
