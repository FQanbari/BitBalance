using BitBalance.Application.Interfaces;
using BitBalance.Domain.ValueObjects;
using Polly;

namespace BitBalance.Infrastructure.External;

public class PollyWrappedProvider : ICryptoPriceProvider
{
    private readonly ICryptoPriceProvider _inner;
    private readonly AsyncPolicy<Money?> _policy;

    public PollyWrappedProvider(ICryptoPriceProvider inner)
    {
        _inner = inner;
        _policy = Policy<Money?>
            .Handle<Exception>()
            .OrResult(r => r == null)
            .WaitAndRetryAsync(3, attempt => TimeSpan.FromSeconds(attempt));
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
