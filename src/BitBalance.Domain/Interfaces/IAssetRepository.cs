using BitBalance.Domain.Entities;

namespace BitBalance.Domain.Interfaces;

public interface IAssetRepository
{
    Task<IEnumerable<Asset>> GetAllAsync();
    Task<Asset?> GetByIdAsync(Guid id);
    Task AddAsync(Asset asset);
    Task UpdateAsync(Asset asset);
    Task DeleteAsync(Guid id);
}
