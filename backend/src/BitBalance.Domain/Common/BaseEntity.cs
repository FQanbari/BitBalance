using BitBalance.Domain.Entities;
using BitBalance.Domain.Interfaces;

namespace BitBalance.Domain.Common;

public interface IEntity { }

public abstract class BaseEntity<TKey>: IEntity
{
    public TKey Id { get; protected set; }
    public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;
    private List<IDomainEvent> _domainEvents = new();
    public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    protected void AddDomainEvent(IDomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    public void ClearDomainEvents() => _domainEvents.Clear();
}
