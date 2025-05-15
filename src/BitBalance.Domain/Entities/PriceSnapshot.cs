using BitBalance.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using BitBalance.Domain.Common;

namespace BitBalance.Domain.Entities;

public class PriceSnapshot: BaseEntity<Guid>
{
    public CoinSymbol CoinSymbol { get; private set; }
    public Money Price { get; private set; }

    protected PriceSnapshot() { } // EF Core و Serialization

    public PriceSnapshot(CoinSymbol coinSymbol, Money price, DateTime timestamp)
    {
        if (coinSymbol == null) throw new ArgumentNullException(nameof(coinSymbol));
        if (price == null) throw new ArgumentNullException(nameof(price));

        Id = Guid.NewGuid();
        CoinSymbol = coinSymbol;
        Price = price;
        CreatedAt = timestamp;
    }
}
public class PriceSnapshotConfiguration : IEntityTypeConfiguration<PriceSnapshot>
{
    public void Configure(EntityTypeBuilder<PriceSnapshot> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.CoinSymbol)
            .HasConversion(
                cs => cs.Symbol,
                s => CoinSymbol.From(s))
            .IsRequired()
            .HasMaxLength(10);


        builder.OwnsOne(p => p.Price, money =>
        {
            money.Property(m => m.Amount)
                 .HasColumnName("PriceAmount")
                 .HasPrecision(18, 6);

            money.Property(m => m.Currency)
                 .HasColumnName("PriceCurrency")
                 .HasMaxLength(5);
        });

        builder.Property(p => p.CreatedAt)
            .IsRequired();
    }
}
