using BitBalance.Application.Interfaces;
using BitBalance.Domain.ValueObjects;
using BitBalance.Infrastructure.SignalR;
using Microsoft.Extensions.Logging;

namespace BitBalance.Infrastructure.External;

public abstract class BaseCryptoProvider : ICryptoPriceProvider
{
    private ICryptoPriceProvider? _next;
    protected readonly PriceBroadcaster _notifier;

    protected BaseCryptoProvider(PriceBroadcaster notifier)
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
            await _notifier.BroadcastProviderUsed(GetType().Name);
            await _notifier.BroadcastPriceAsync(symbol.Symbol, result.Amount);
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
