using BitBalance.Domain.Exceptions;
using BitBalance.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using BitBalance.Domain.Interfaces;
using BitBalance.Domain.Common;
using BitBalance.Domain.Events;

namespace BitBalance.Domain.Entities;

public class Portfolio : BaseEntity<Guid>, IAggregateRoot
{
    public string Name { get; private set; }
    public Guid UserId { get; private set; }
    private readonly List<Asset> _assets = new();
    public IList<Asset> Assets => _assets.AsReadOnly();
    private readonly List<Alert> _alerts = new();
    public IReadOnlyCollection<Alert> Alerts => _alerts.AsReadOnly();

    public Portfolio(Guid userId, string name)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Name = name;
        CreatedAt = DateTime.UtcNow;
    }

    public void AddAsset(Asset asset)
    {
        if (asset == null)
            throw new DomainException("Asset cannot be null.");

        //asset.SetPortfolioId(this.Id);
        _assets.Add(asset);
        AddDomainEvent(new AssetAddedEvent(this.Id, asset));
    }

    public void RemoveAsset(Guid assetId)
    {
        var asset = _assets.FirstOrDefault(a => a.Id == assetId);
        if (asset != null)
            _assets.Remove(asset);
    }

    public void AddAlert(Alert alert)
    {
        if (alert == null)
            throw new DomainException("Alert cannot be null.");
        _alerts.Add(alert);
    }
    public void RemoveAlert(Guid alertId)
    {
        var alert = _alerts.FirstOrDefault(a => a.Id == alertId);
        if (alert != null)
            _alerts.Remove(alert);
    }
    public Money TotalInvestmentValue()
    {
        return _assets.Select(a => a.TotalCost).Aggregate(Money.Zero(), (acc, val) => acc + val);
    }
    public Money GetTotalValue(Func<CoinSymbol, Money> getCurrentPrice)
    {
        if (!_assets.Any())
            return Money.Zero(); // defualt‌: USD

        var currency = _assets.First().PurchasePrice.Currency;
        var total = Money.Zero(currency);

        foreach (var asset in _assets)
        {
            var currentPrice = getCurrentPrice(asset.CoinSymbol);
            var currentValue = asset.GetCurrentValue(currentPrice);
            total += currentValue;
        }

        return total;
    }

}
public class PortfolioConfiguration : IEntityTypeConfiguration<Portfolio>
{
    public void Configure(EntityTypeBuilder<Portfolio> builder)
    {
        builder.HasKey(p => p.Id);

        builder
             .HasMany(p => p.Assets)
             .WithOne()
             //.WithOne(a => a.Portfolio)
             .HasForeignKey("PortfolioId") // Shadow property
             .OnDelete(DeleteBehavior.Cascade);

        builder
            .Metadata
            .FindNavigation(nameof(Portfolio.Assets))!
            .SetPropertyAccessMode(PropertyAccessMode.Field);


        builder.Property(p => p.CreatedAt)
           .IsRequired();

        builder.OwnsMany(p => p.Alerts, a =>
        {
            a.WithOwner().HasForeignKey("PortfolioId");

            a.HasKey(p => p.Id);

            a.Property(p => p.Type)
                .HasConversion<int>()
                .IsRequired();

            a.Property(p => p.IsTriggered).IsRequired();
            a.Property(p => p.CreatedAt).IsRequired();

            a.OwnsOne(p => p.CoinSymbol, cs =>
            {
                cs.Property(c => c.Symbol)
                  .HasColumnName("CoinSymbol")
                  .HasMaxLength(10)
                  .IsRequired();
            });

            a.OwnsOne(p => p.TargetPrice, tp =>
            {
                tp.Property(p => p.Amount)
                  .HasColumnName("TargetAmount")
                  .HasPrecision(18, 2);

                tp.Property(p => p.Currency)
                  .HasColumnName("TargetCurrency")
                  .HasMaxLength(5);
            });

            a.ToTable("PortfolioAlerts"); 
        });
    }
}
