using BitBalance.Domain.Entities;
using BitBalance.Domain.Interfaces;
using BitBalance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BitBalance.Infrastructure.Repositories;

public class PortfolioRepository : IPortfolioRepository
{
    private readonly BitBalanceDbContext _context;

    public PortfolioRepository(BitBalanceDbContext context)
    {
        _context = context;
    }

    public async Task<Portfolio?> GetByIdAsync(Guid id)
    {
        return await _context.Portfolios
            .Include(p => p.Assets)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task AddAsync(Portfolio portfolio)
    {
        _context.Portfolios.Add(portfolio);
        await _context.SaveChangesAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Portfolio portfolio)
    {
        _context.Portfolios.Update(portfolio);
        await _context.SaveChangesAsync();
    }
}
