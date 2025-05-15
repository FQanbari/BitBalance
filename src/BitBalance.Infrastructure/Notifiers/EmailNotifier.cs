using BitBalance.Application.Interfaces;
using BitBalance.Domain.Entities;

namespace BitBalance.Infrastructure.Notifiers;

public class EmailNotifier : IAlertNotifier
{
    public Task NotifyAsync(Alert alert)
    {
        Console.WriteLine($"Alert triggered for {alert.CoinSymbol.Symbol}");
        return Task.CompletedTask;
    }
}
