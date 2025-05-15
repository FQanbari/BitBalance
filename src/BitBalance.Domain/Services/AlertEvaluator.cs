using BitBalance.Domain.Entities;
using BitBalance.Domain.Enums;
using BitBalance.Domain.Exceptions;
using BitBalance.Domain.ValueObjects;

namespace BitBalance.Domain.Services;

public class AlertEvaluator
{
    public bool ShouldTrigger(Alert alert, Money currentPrice)
    {
        if (alert == null)
            throw new ArgumentNullException(nameof(alert));

        if (currentPrice == null)
            throw new ArgumentNullException(nameof(currentPrice));

        if (alert.TargetPrice.Currency != currentPrice.Currency)
            throw new DomainException("Currency mismatch in alert evaluation.");

        return alert.Type switch
        {
            AlertType.PriceAbove => currentPrice.Amount > alert.TargetPrice.Amount,
            AlertType.PriceBelow => currentPrice.Amount < alert.TargetPrice.Amount,
            _ => throw new NotSupportedException($"AlertType '{alert.Type}' not supported.")
        };
    }
}
