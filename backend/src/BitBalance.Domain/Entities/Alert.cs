using BitBalance.Domain.Common;
using BitBalance.Domain.Enums;
using BitBalance.Domain.Exceptions;
using BitBalance.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace BitBalance.Domain.Entities;

public class Alert: BaseEntity<Guid>
{
    public CoinSymbol CoinSymbol { get; private set; }
    public Money TargetPrice { get; private set; }
    public AlertType Type { get; private set; }
    public bool IsTriggered { get; private set; }

    protected Alert() { }

    public Alert(CoinSymbol coinSymbol, AlertType type, Money targetPrice)
    {
        CoinSymbol = coinSymbol ?? throw new ArgumentNullException(nameof(coinSymbol));
        Type = type;
        TargetPrice = targetPrice ?? throw new ArgumentNullException(nameof(targetPrice));
        CreatedAt = DateTime.UtcNow;
        IsTriggered = false;
    }

    public void MarkAsTriggered() => IsTriggered = true;
}
