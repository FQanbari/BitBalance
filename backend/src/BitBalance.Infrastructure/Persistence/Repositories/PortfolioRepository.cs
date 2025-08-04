using BitBalance.Domain.Entities;
using BitBalance.Domain.Interfaces;
using BitBalance.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BitBalance.Infrastructure.Persistence.Repositories;

public class PortfolioRepository : IPortfolioRepository
{
    private readonly BitBalanceDbContext _context;

    public PortfolioRepository(BitBalanceDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Portfolio>> GetAllByUserAsync(Guid userId)
    {
        return await _context.Portfolios
               .Include(p => p.Assets)
               .Include(p => p.Alerts)
               .Where(p => p.UserId == userId).ToListAsync();
    }
    public async Task<Portfolio?> GetByIdAsync(Guid id)
    {
        return await _context.Portfolios
               .Include(p => p.Assets)
               .Include(p => p.Alerts)
               .Where(p => p.Id == id).FirstOrDefaultAsync();
    }

    public async Task AddAsync(Portfolio portfolio)
    {
        _context.Portfolios.Add(portfolio);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Portfolio portfolio)
    {
        _context.Portfolios.Update(portfolio);
    }
    public async Task RemoveAsync(Portfolio portfolio)
    {
        _context.Portfolios.Remove(portfolio);
    }
    public async Task<List<Portfolio>> GetAllWithAlertsAsync(Guid userId)
    {
        //return await _context.Portfolios
        //.Include(p => p.Alerts)
        //.ToListAsync();
        return await _context.Portfolios
            .Include(p => p.Alerts)
            .Where(p => p.UserId == userId)
            .ToListAsync();

    }
}
