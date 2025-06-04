using BitBalance.API.Extensions;
using BitBalance.Application.Alerts.Commands;
using BitBalance.Application.Alerts.Queries;
using BitBalance.Application.Portfolios.Commands;
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
        var modifiedCommand = command with { UserId = User.GetUserIdAsGuid() };
        var alertId = await _mediator.Send(modifiedCommand);
        return CreatedAtAction(nameof(GetActiveAlerts), new { portfolioId = command.PortfolioId }, alertId);
    }

    [HttpGet("{portfolioId}/active")]
    public async Task<IActionResult> GetActiveAlerts(Guid portfolioId)
    {
        var alerts = await _mediator.Send(new GetActiveAlertsQuery(portfolioId));
        return Ok(alerts);
    }
    [HttpGet("active")]
    public async Task<IActionResult> GetAllActiveAlerts(Guid portfolioId)
    {
        var alerts = await _mediator.Send(new GetActiveAlertsQuery(User.GetUserIdAsGuid()));
        return Ok(alerts);
    }

    [HttpPost("evaluate")]
    public async Task<IActionResult> EvaluateAlerts()
    {
        await _mediator.Send(new EvaluateAlertsCommand(User.GetUserIdAsGuid()));
        return NoContent();
    }
    [HttpDelete("{portfolioId}/{assetId}")]
    public async Task<IActionResult> RemoveAlert(Guid portfolioId, Guid assetId)
    {
        var command = new RemoveAlertCommand(portfolioId, assetId);
        await _mediator.Send(command);
        return NoContent();
    }
}