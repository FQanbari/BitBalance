using BitBalance.Domain.Common;
using BitBalance.Domain.Enums;
using BitBalance.Domain.Exceptions;
using BitBalance.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace BitBalance.Domain.Entities;

public class Alert:BaseEntity<Guid>
{
    public CoinSymbol CoinSymbol { get; private set; }
    public AlertType Type { get; private set; }
    public Money TargetPrice { get; private set; }
    public bool IsTriggered { get; private set; }

    protected Alert() { }
    public Alert(CoinSymbol coinSymbol, AlertType type, Money targetPrice)
    {
        Id = Guid.NewGuid();
        CoinSymbol = coinSymbol ?? throw new ArgumentNullException(nameof(coinSymbol));
        Type = type;
        TargetPrice = targetPrice ?? throw new ArgumentNullException(nameof(targetPrice));
        CreatedAt = DateTime.UtcNow;
        IsTriggered = false;
    }

    public void Evaluate(Money currentPrice)
    {
        if (TargetPrice.Currency != currentPrice.Currency)
            throw new DomainException("Currency mismatch in alert evaluation.");

        IsTriggered = Type switch
        {
            AlertType.PriceAbove => currentPrice.Amount > TargetPrice.Amount,
            AlertType.PriceBelow => currentPrice.Amount < TargetPrice.Amount,
            _ => false
        };
    }
}
public class AlertConfiguration : IEntityTypeConfiguration<Alert>
{
    public void Configure(EntityTypeBuilder<Alert> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.CoinSymbol)
               .HasConversion(
                    cs => cs.Symbol,
                    s => CoinSymbol.From(s))
               .IsRequired()
               .HasMaxLength(10);

        builder.OwnsOne(a => a.TargetPrice, tp =>
        {
            tp.Property(p => p.Amount)
              .HasColumnName("TargetAmount")
              .HasPrecision(18, 2);

            tp.Property(p => p.Currency)
              .HasColumnName("TargetCurrency")
              .HasMaxLength(5);
        });

        builder.Property(a => a.Type)
               .IsRequired();

        builder.Property(a => a.IsTriggered)
               .IsRequired();

        builder.Property(a => a.CreatedAt)
               .IsRequired();
    }
}
