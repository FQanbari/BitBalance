using BitBalance.Domain.Exceptions;
using BitBalance.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BitBalance.Domain.Entities;
public class Asset
{
    public Guid Id { get; private set; }
    public string Symbol { get; private set; } 
    public Money Quantity { get; private set; }
    public Money PurchasePrice { get; private set; }
    public DateTime PurchaseDate { get; private set; }

    public Asset(string symbol, Money quantity, Money purchasePrice, DateTime purchaseDate)
    {
        if (string.IsNullOrWhiteSpace(symbol))
            throw new DomainException("Symbol is required.");

        Id = Guid.NewGuid();
        Symbol = symbol;
        Quantity = quantity ?? throw new ArgumentNullException(nameof(quantity));
        PurchasePrice = purchasePrice ?? throw new ArgumentNullException(nameof(purchasePrice)); ;
        PurchaseDate = purchaseDate;
    }

    public Money TotalCost => Quantity * PurchasePrice;
    public void UpdateQuantity(Money newQuantity)
    {
        Quantity = newQuantity ?? throw new ArgumentNullException(nameof(newQuantity));
    }
}
public class AssetConfiguration : IEntityTypeConfiguration<Asset>
{
    public void Configure(EntityTypeBuilder<Asset> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Symbol)
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
    }
}
