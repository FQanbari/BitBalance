using BitBalance.Domain.Exceptions;
using BitBalance.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace BitBalance.Domain.Entities;

public class Portfolio
{
    public Guid Id { get; private set; }
    private readonly List<Asset> _assets = new();

    public IReadOnlyCollection<Asset> Assets => _assets.AsReadOnly();

    public Portfolio()
    {
        Id = Guid.NewGuid();
    }

    public void AddAsset(Asset asset)
    {
        if (asset == null)
            throw new DomainException("Asset cannot be null.");

        _assets.Add(asset);
    }

    public void RemoveAsset(Guid assetId)
    {
        var asset = _assets.FirstOrDefault(a => a.Id == assetId);
        if (asset != null)
            _assets.Remove(asset);
    }

    public Money TotalInvestmentValue()
    {
        return _assets.Select(a => a.TotalCost).Aggregate(Money.Zero(), (acc, val) => acc + val);
    }
}
public class PortfolioConfiguration : IEntityTypeConfiguration<Portfolio>
{
    public void Configure(EntityTypeBuilder<Portfolio> builder)
    {
        builder.HasKey(p => p.Id);

        builder
            .HasMany<Asset>()
            .WithOne() 
            .OnDelete(DeleteBehavior.Cascade);
    }
}