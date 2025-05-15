using BitBalance.Application.Interfaces;
using BitBalance.Domain.Interfaces;
using BitBalance.Domain.Services;
using MediatR;

namespace BitBalance.Application.Alerts.Commands;

public record EvaluateAlertsCommand : IRequest<Unit>;
public class EvaluateAlertsCommandHandler : IRequestHandler<EvaluateAlertsCommand, Unit>
{
    private readonly IPortfolioRepository _portfolioRepository;
    private readonly ICryptoPriceProvider _priceProvider;
    private readonly IAlertNotifier _notifier;
    private readonly AlertEvaluator _evaluator;
    private readonly IUnitOfWork _unitOfWork;

    public EvaluateAlertsCommandHandler(
        IPortfolioRepository portfolioRepository,
        ICryptoPriceProvider priceProvider,
        IAlertNotifier notifier,
        AlertEvaluator evaluator,
        IUnitOfWork unitOfWork)
    {
        _portfolioRepository = portfolioRepository;
        _priceProvider = priceProvider;
        _notifier = notifier;
        _evaluator = evaluator;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(EvaluateAlertsCommand request, CancellationToken cancellationToken)
    {
        var portfolios = await _portfolioRepository.GetAllWithAlertsAsync();

        foreach (var portfolio in portfolios)
        {
            foreach (var alert in portfolio.Alerts.Where(a => !a.IsTriggered))
            {
                var currentPrice = await _priceProvider.GetPriceAsync(alert.CoinSymbol);

                if (_evaluator.ShouldTrigger(alert, currentPrice))
                {
                    alert.MarkAsTriggered(); 
                    await _notifier.NotifyAsync(alert); 
                }
            }
        }

        await _unitOfWork.SaveChangesAsync();
        return Unit.Value;
    }
}

