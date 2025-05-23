using BitBalance.Domain.Entities;

namespace BitBalance.Domain.Interfaces;

public interface IPriceSnapshotRepository
{
    Task AddAsync(PriceSnapshot snapshot);
}
