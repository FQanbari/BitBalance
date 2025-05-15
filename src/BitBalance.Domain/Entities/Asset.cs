using BitBalance.Domain.Common;
using BitBalance.Domain.Exceptions;
using BitBalance.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BitBalance.Domain.Entities;
public class Asset: BaseEntity<Guid>
{
    public CoinSymbol CoinSymbol { get; private set; } 
    public Money Quantity { get; private set; }
    public Money PurchasePrice { get; private set; }
    public DateTime PurchaseDate { get; private set; }

    protected Asset() { }
    public Asset(CoinSymbol symbol, Money quantity, Money purchasePrice, DateTime purchaseDate)
    {
        if (symbol is null)
            throw new DomainException("Symbol is required.");

        Id = Guid.NewGuid();
        CoinSymbol = symbol;
        Quantity = quantity ?? throw new ArgumentNullException(nameof(quantity));
        PurchasePrice = purchasePrice ?? throw new ArgumentNullException(nameof(purchasePrice)); ;
        PurchaseDate = purchaseDate;
        CreatedAt = DateTime.UtcNow;
    }

    public Money TotalCost => Quantity * PurchasePrice;
    public void UpdateQuantity(Money newQuantity)
    {
        Quantity = newQuantity ?? throw new ArgumentNullException(nameof(newQuantity));
    }
    public Money GetCurrentValue(Money currentPrice)
    {
        return Quantity * currentPrice;
    }

    public Money GetProfitLoss(Money currentPrice)
    {
        return GetCurrentValue(currentPrice) - (Quantity * PurchasePrice);
    }
}
public class AssetConfiguration : IEntityTypeConfiguration<Asset>
{
    public void Configure(EntityTypeBuilder<Asset> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(p => p.CoinSymbol)
            .HasConversion(
                cs => cs.Symbol,
                s => CoinSymbol.From(s))
            .IsRequired()
            .HasMaxLength(10);

        builder.OwnsOne(a => a.Quantity, q =>
        {
            q.Property(p => p.Amount)
             .HasColumnName("QuantityAmount")
             .HasPrecision(18, 2);

            q.Property(p => p.Currency)
             .HasColumnName("QuantityCurrency")
             .HasMaxLength(5);
        });

        builder.OwnsOne(a => a.PurchasePrice, pp =>
        {
            pp.Property(p => p.Amount)
              .HasColumnName("PriceAmount")
              .HasPrecision(18, 2);

            pp.Property(p => p.Currency)
              .HasColumnName("PriceCurrency")
              .HasMaxLength(5);
        });

        builder.Property(a => a.PurchaseDate).IsRequired();
        builder.Property(a => a.CreatedAt).IsRequired();
    }
}
