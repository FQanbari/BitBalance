using BitBalance.Domain.Entities;
using BitBalance.Domain.Interfaces;

namespace BitBalance.Infrastructure.Persistence.Repositories;

public class PriceSnapshotRepository : IPriceSnapshotRepository
{
    private readonly BitBalanceDbContext _context;

    public PriceSnapshotRepository(BitBalanceDbContext context)
    {
        _context = context;
    }
    public async Task AddAsync(PriceSnapshot snapshot)
    {
        await _context.PriceSnapshots.AddAsync(snapshot);
    }
}
