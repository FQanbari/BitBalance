using BitBalance.Application.Interfaces;
using BitBalance.Domain.ValueObjects;
using BitBalance.Infrastructure.External.CoinGecko;
using Microsoft.Extensions.Options;
using Polly;

namespace BitBalance.Infrastructure.External;

public class PollyWrappedProvider : ICryptoPriceProvider
{
    private readonly ICryptoPriceProvider _inner;
    private readonly AsyncPolicy<Money?> _policy;

    public PollyWrappedProvider(ICryptoPriceProvider inner, IOptions<PriceFetcherOptions> options)
    {
        _inner = inner;
        _policy = Policy<Money?>
                     .Handle<Exception>()
                     .OrResult(r => r == null)
                     .WaitAndRetryAsync(
                         options.Value.RetryCount,
                        attempt => TimeSpan.FromSeconds(
                        options.Value.UseExponentialBackoff ? Math.Pow(2, attempt) : options.Value.InitialDelaySeconds)
                        );
    }

    public ICryptoPriceProvider? SetNext(ICryptoPriceProvider next)
    {
        return _inner.SetNext(next);
    }

    public async Task<Money?> TryGetPriceAsync(CoinSymbol symbol)
    {
        return await _policy.ExecuteAsync(() => _inner.TryGetPriceAsync(symbol));
    }
}
