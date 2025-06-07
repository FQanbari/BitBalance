using Microsoft.AspNetCore.SignalR;

namespace BitBalance.Infrastructure.SignalR;

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
