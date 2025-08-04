using BitBalance.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BitBalance.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly BitBalanceDbContext _context;
    private readonly ILogger<UnitOfWork> _logger;

    public UnitOfWork(BitBalanceDbContext context, ILogger<UnitOfWork> logger)
    {
        _context = context;
        _logger = logger;
    }

    public DbContext Context => _context;

    public async Task SaveChangesAsync()
    {
        foreach (var entry in _context.ChangeTracker.Entries())
        {
            _logger.LogInformation($"{entry.Entity.GetType().Name} - {entry.State}");
        }
        await _context.SaveChangesAsync();
    }
}
