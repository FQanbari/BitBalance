using BitBalance.Domain.Entities;

namespace BitBalance.Domain.Interfaces;

public interface IUserSettingsRepository
{
    Task<UserSettings?> GetByUserIdAsync(Guid userId);
    Task AddAsync(UserSettings settings);
}
