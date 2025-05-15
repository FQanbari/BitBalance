using BitBalance.Application.Alerts.Commands;
using BitBalance.Application.Alerts.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BitBalance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlertsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AlertsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAlertCommand command)
    {
        var alertId = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetActiveAlerts), new { portfolioId = command.PortfolioId }, alertId);
    }

    [HttpGet("{portfolioId}/active")]
    public async Task<IActionResult> GetActiveAlerts(Guid portfolioId)
    {
        var alerts = await _mediator.Send(new GetActiveAlertsQuery(portfolioId));
        return Ok(alerts);
    }

    [HttpPost("evaluate")]
    public async Task<IActionResult> EvaluateAlerts()
    {
        await _mediator.Send(new EvaluateAlertsCommand());
        return NoContent();
    }
}