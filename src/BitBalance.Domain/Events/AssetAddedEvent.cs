using BitBalance.Domain.Entities;
using BitBalance.Domain.Interfaces;

namespace BitBalance.Domain.Events;

public class AssetAddedEvent : IDomainEvent
{
    public Guid PortfolioId { get; }
    public Asset Asset { get; }

    public AssetAddedEvent(Guid portfolioId, Asset asset)
    {
        PortfolioId = portfolioId;
        Asset = asset ?? throw new ArgumentNullException(nameof(asset));
    }
}
