using BitBalance.API.Extensions;
using BitBalance.API.Filters;
using BitBalance.Application.Portfolios.Commands;
using BitBalance.Application.Portfolios.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BitBalance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[ServiceFilter(typeof(RequestLoggingFilter))]
public class PortfoliosController : ControllerBase
{
    private readonly IMediator _mediator;

    public PortfoliosController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.GetUserIdAsGuid();
        var portfolio = await _mediator.Send(new GetAllPortfoliosQuery(userId));
        if (portfolio == null)
            return NotFound();

        return Ok(portfolio);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePortfolioCommand command)
    {
        var modifiedCommand = command with { UserId = User.GetUserIdAsGuid() };
        var portfolioId = await _mediator.Send(modifiedCommand);
        return CreatedAtAction(nameof(GetById), new { id = portfolioId }, null);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var portfolio = await _mediator.Send(new GetPortfolioByIdQuery(id));
        if (portfolio == null)
            return NotFound();

        return Ok(portfolio);
    }

    [HttpPost("{portfolioId}/assets")]
    public async Task<IActionResult> AddAsset(Guid portfolioId, [FromBody] AddAssetCommand command)
    {
        if (portfolioId != command.PortfolioId)
            return BadRequest("Portfolio ID mismatch");

        await _mediator.Send(command);
        return NoContent();
    }
    [HttpDelete("{portfolioId}")]
    public async Task<IActionResult> RemovePortfolio(Guid portfolioId)
    {
        var command = new RemovePortfolioCommand(portfolioId);
        await _mediator.Send(command);
        return NoContent();
    }
    [HttpDelete("{portfolioId}/assets/{assetId}")]
    public async Task<IActionResult> RemoveAsset(Guid portfolioId, Guid assetId)
    {
        var command = new RemoveAssetCommand(portfolioId, assetId);
        await _mediator.Send(command);
        return NoContent();
    }
}
