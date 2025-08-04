using BitBalance.Domain.Entities;
using BitBalance.Domain.Interfaces;
using BitBalance.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace BitBalance.Infrastructure.Persistence.Repositories;

public class PriceSnapshotRepository : IPriceSnapshotRepository
{
    private readonly BitBalanceDbContext _context;

    public PriceSnapshotRepository(BitBalanceDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CoinSymbol>> GetAllCoinSymbols()
    {
        return await _context.PriceSnapshots
              .Select(p => p.CoinSymbol)
              .Distinct()
              .ToListAsync();
    }

    public async Task UpsertSnapshotAsync(PriceSnapshot snapshot)
    {
        var existing = await _context.PriceSnapshots
            .FirstOrDefaultAsync(p => p.CoinSymbol == snapshot.CoinSymbol);

        if (existing != null)
        {
            existing.UpdatePrice(snapshot.Price);
            //_context.PriceSnapshots.Update(snapshot);
        }
        else
        {
            var model = new PriceSnapshot(snapshot.CoinSymbol, snapshot.Price, DateTime.UtcNow);
            await _context.PriceSnapshots.AddAsync(snapshot);
        }
    }
}
