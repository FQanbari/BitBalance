using BitBalance.Domain.Entities;
using BitBalance.Domain.Interfaces;
using BitBalance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BitBalance.Infrastructure.Repositories;

public class AssetRepository : IAssetRepository
{
    private readonly BitBalanceDbContext _context;

    public AssetRepository(BitBalanceDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Asset asset)
    {
        _context.Assets.Add(asset);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var asset = await _context.Assets.Where(x => x.Id == id).FirstOrDefaultAsync();
        _context.Assets.Remove(asset);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Asset>> GetAllAsync()
    {
        return await _context.Assets.ToListAsync();
    }

    public async Task<Asset?> GetByIdAsync(Guid id)
    {
        return await _context.Assets.FindAsync(id);
    }

    public async Task UpdateAsync(Asset asset)
    {
        _context.Assets.Update(asset);
        await _context.SaveChangesAsync();
    }

}
