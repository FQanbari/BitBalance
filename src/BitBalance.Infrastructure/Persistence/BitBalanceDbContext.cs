using BitBalance.Domain.Common;
using BitBalance.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace BitBalance.Infrastructure.Persistence;

public class BitBalanceDbContext : DbContext
{
    public BitBalanceDbContext(DbContextOptions<BitBalanceDbContext> options) : base(options) { }

    public DbSet<Portfolio> Portfolios => Set<Portfolio>();
    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<PriceSnapshot> PriceSnapshots => Set<PriceSnapshot>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(IEntity).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
