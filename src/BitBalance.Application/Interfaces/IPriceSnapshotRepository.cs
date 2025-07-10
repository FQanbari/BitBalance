using BitBalance.Domain.Entities;
using BitBalance.Domain.ValueObjects;

namespace BitBalance.Domain.Interfaces;

public interface IPriceSnapshotRepository
{
    Task<IEnumerable<CoinSymbol>> GetAllCoinSymbols();
    Task UpsertSnapshotAsync(PriceSnapshot snapshot);
}
