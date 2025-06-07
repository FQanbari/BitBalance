using BitBalance.Application.Interfaces;
using BitBalance.Domain.ValueObjects;
using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;

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

    public ICryptoPriceProvider? SetNext(ICryptoPriceProvider next)
    {
        return _inner.SetNext(next);
    }

    public async Task<Money?> TryGetPriceAsync(CoinSymbol symbol)
    {
        var cacheKey = $"price_{symbol.Symbol}";

        if (_cache.TryGetValue(cacheKey, out Money cached))
        {
            return cached;
        }

        var price = await _inner.TryGetPriceAsync(symbol);

        if (price != null)
        {
            _cache.Set(cacheKey, price, _cacheDuration);
        }

        return price;
    }
}
