using BitBalance.Application.Interfaces;
using BitBalance.Domain.ValueObjects;
using BitBalance.Infrastructure.SignalR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Polly;

namespace BitBalance.Infrastructure.Fallback;

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
public class PriceRequestNotifier
{
    private readonly IHubContext<PriceHub> _hub;

    public PriceRequestNotifier(IHubContext<PriceHub> hub)
    {
        _hub = hub;
    }

    public async Task NotifyProviderUsed(string providerName)
    {
        await _hub.Clients.All.SendAsync("ProviderUsed", providerName);
    }
}

public abstract class BaseCryptoProvider : ICryptoPriceProvider
{
    private ICryptoPriceProvider? _next;
    protected readonly PriceRequestNotifier _notifier;

    protected BaseCryptoProvider(PriceRequestNotifier notifier)
    {
        _notifier = notifier;
    }

    public ICryptoPriceProvider? SetNext(ICryptoPriceProvider next)
    {
        _next = next;
        return next;
    }

    public async Task<Money?> TryGetPriceAsync(CoinSymbol symbol)
    {
        var result = await GetPriceInternalAsync(symbol);
        if (result != null)
        {
            await _notifier.NotifyProviderUsed(GetType().Name);
            return result;
        }
        else if (_next != null)
        {
            return await _next.TryGetPriceAsync(symbol);
        }

        return null;
    }

    protected abstract Task<Money?> GetPriceInternalAsync(CoinSymbol symbol);
}
