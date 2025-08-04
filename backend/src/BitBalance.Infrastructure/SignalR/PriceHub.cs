using Microsoft.AspNetCore.SignalR;

namespace BitBalance.Infrastructure.SignalR;

public class PriceHub : Hub
{
    public async Task SendPriceAlert(string symbol, decimal price)
    {
        await Clients.All.SendAsync("ReceivePriceAlert", symbol, price);
    }
}
