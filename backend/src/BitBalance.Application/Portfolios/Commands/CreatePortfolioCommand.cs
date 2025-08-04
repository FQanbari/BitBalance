using BitBalance.Application.Interfaces;
using BitBalance.Domain.Entities;
using BitBalance.Domain.Interfaces;
using BitBalance.Domain.ValueObjects;
using FluentValidation;
using MediatR;

namespace BitBalance.Application.Portfolios.Commands;

public record CreatePortfolioCommand(Guid UserId,string Name) : IRequest<Guid>;
public class CreatePortfolioCommandValidator : AbstractValidator<CreatePortfolioCommand>
{
    public CreatePortfolioCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    }
}

public class CreatePortfolioCommandHandler : IRequestHandler<CreatePortfolioCommand, Guid>
{
    private readonly IPortfolioRepository _repo;
    private readonly IUnitOfWork _uow;

    public CreatePortfolioCommandHandler(IPortfolioRepository repo, IUnitOfWork uow)
    {
        _repo = repo;
        _uow = uow;
    }

    public async Task<Guid> Handle(CreatePortfolioCommand request, CancellationToken cancellationToken)
    {
        var portfolio = new Portfolio(request.UserId ,request.Name);
        await _repo.AddAsync(portfolio);
        await _uow.SaveChangesAsync();

        return portfolio.Id;
    }
}
