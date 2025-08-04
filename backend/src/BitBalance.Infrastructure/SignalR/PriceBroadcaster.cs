using BitBalance.Domain.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace BitBalance.Infrastructure.SignalR;

public class PriceBroadcaster: IPriceBroadcaster
{
    private readonly IHubContext<PriceHub> _hub;

    public PriceBroadcaster(IHubContext<PriceHub> hub)
    {
        _hub = hub;
    }

    public async Task BroadcastProviderUsed(string providerName)
    {
        await _hub.Clients.All.SendAsync("ProviderUsed", providerName);
    }
    public async Task BroadcastPriceAsync(string symbol, decimal price)
    {
        await _hub.Clients.All.SendAsync("ReceivePriceAlert", symbol, price);
    }
}
