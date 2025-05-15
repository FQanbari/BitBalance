using BitBalance.Domain.Entities;

namespace BitBalance.Domain.Interfaces;

public interface IPortfolioRepository
{
    Task<Portfolio?> GetByIdAsync(Guid id);
    Task AddAsync(Portfolio portfolio);
    Task UpdateAsync(Portfolio portfolio);
    Task<List<Portfolio>> GetAllWithAlertsAsync();
}