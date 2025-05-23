using BitBalance.Application.Interfaces;
using BitBalance.Domain.Interfaces;
using FluentValidation;
using MediatR;
using BitBalance.Domain.Entities;

namespace BitBalance.Application.UserSettings.Command;

public record UpdateUserSettingsCommand(
    Guid UserId, 
    string DefaultCurrency = "USD", 
    string NotificationMethod = "email", 
    string Theme = "light", 
    string Language = "en") : IRequest<Unit>;
public class UpdateUserSettingsCommandValidator : AbstractValidator<UpdateUserSettingsCommand>
{
    public UpdateUserSettingsCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId is required.");

        RuleFor(x => x.DefaultCurrency)
            .NotEmpty().Length(3, 5).WithMessage("Currency must be a valid 3-5 letter code.");

        RuleFor(x => x.NotificationMethod)
            .Must(v => new[] { "email", "telegram", "none" }.Contains(v.ToLower()))
            .WithMessage("Invalid notification method.");

        RuleFor(x => x.Theme)
            .Must(v => new[] { "light", "dark" }.Contains(v.ToLower()))
            .WithMessage("Theme must be 'light' or 'dark'.");

        RuleFor(x => x.Language)
            .Length(2, 5).WithMessage("Language code must be 2-5 characters.");
    }
}

public class UpdateUserSettingsCommandHandler : IRequestHandler<UpdateUserSettingsCommand, Unit>
{
    private readonly IUserSettingsRepository _repo;
    private readonly IUnitOfWork _uow;

    public UpdateUserSettingsCommandHandler(IUserSettingsRepository repo, IUnitOfWork uow)
    {
        _repo = repo;
        _uow = uow;
    }

    public async Task<Unit> Handle(UpdateUserSettingsCommand request, CancellationToken cancellationToken)
    {
        var settings = await _repo.GetByUserIdAsync(request.UserId);

        if (settings == null)
        {
            settings = new Domain.Entities.UserSettings(
                request.UserId,
                request.DefaultCurrency,
                request.NotificationMethod,
                request.Theme,
                request.Language
            );
            await _repo.AddAsync(settings);
        }
        else
        {
            settings.Update(
                request.DefaultCurrency,
                request.NotificationMethod,
                request.Theme,
                request.Language
            );
        }

        await _uow.SaveChangesAsync();
        return Unit.Value;
    }
}
