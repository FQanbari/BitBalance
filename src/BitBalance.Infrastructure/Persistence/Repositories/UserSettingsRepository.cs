using BitBalance.Domain.Entities;
using BitBalance.Domain.Interfaces;

namespace BitBalance.Infrastructure.Persistence.Repositories;

public class UserSettingsRepository : IUserSettingsRepository
{
    private readonly BitBalanceDbContext _context;

    public UserSettingsRepository(BitBalanceDbContext context)
    {
        _context = context;
    }

    public async Task<UserSettings?> GetByUserIdAsync(Guid userId)
    {
        return await _context.UserSettings.FirstOrDefaultAsync(s => s.UserId == userId);
    }

    public async Task AddAsync(UserSettings settings)
    {
        await _context.UserSettings.AddAsync(settings);
    }
}
