using BitBalance.Application.Interfaces;

namespace BitBalance.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly BitBalanceDbContext _context;

    public UnitOfWork(BitBalanceDbContext context)
    {
        _context = context;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
