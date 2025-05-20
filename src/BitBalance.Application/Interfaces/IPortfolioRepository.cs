using BitBalance.Domain.Entities;

namespace BitBalance.Domain.Interfaces;

public interface IPortfolioRepository
{
    Task<IEnumerable<Portfolio>> GetAllByUserAsync(Guid userId);
    Task<Portfolio?> GetByIdAsync(Guid id);
    Task AddAsync(Portfolio portfolio);
    Task UpdateAsync(Portfolio portfolio);
    Task<List<Portfolio>> GetAllWithAlertsAsync();
}