using BitBalance.Application.UserSettings.Dtos;
using BitBalance.Domain.Interfaces;
using MediatR;

namespace BitBalance.Application.UserSettings.Queries;

public record GetUserSettingsQuery(Guid UserId) : IRequest<UserSettingsDto>;
public class GetUserSettingsQueryHandler : IRequestHandler<GetUserSettingsQuery, UserSettingsDto>
{
    private readonly IUserSettingsRepository _repo;

    public GetUserSettingsQueryHandler(IUserSettingsRepository repo)
    {
        _repo = repo;
    }

    public async Task<UserSettingsDto> Handle(GetUserSettingsQuery request, CancellationToken cancellationToken)
    {
        var settings = await _repo.GetByUserIdAsync(request.UserId);

        if (settings == null)
            throw new ApplicationException("UserSettings not found.");

        return new UserSettingsDto
        {
            DefaultCurrency = settings.DefaultCurrency,
            NotificationMethod = settings.NotificationMethod,
            Theme = settings.Theme,
            Language = settings.Language
        };
    }
}

