using MediatR;

namespace BitBalance.Application.UserSettings.Command;

public record CreateUserSettingsCommand(
    Guid UserId, 
    string DefaultCurrency, 
    string NotificationMethod, 
    string Theme, 
    string Language) : IRequest<Unit>;
