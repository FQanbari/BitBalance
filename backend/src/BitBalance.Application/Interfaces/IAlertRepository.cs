
using BitBalance.Domain.Entities;

namespace BitBalance.Application.Interfaces;

public interface IAlertRepository
{
    Task<List<Alert>> GetActiveAlertsAsync();
    Task<Alert?> GetByIdAsync(Guid id);
    Task SaveChangesAsync();
}
