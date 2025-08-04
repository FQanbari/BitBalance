using BitBalance.Application.Analysis.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BitBalance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalysisController : ControllerBase
{
    private readonly IMediator _mediator;

    public AnalysisController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("portfolio/{portfolioId}/allocation")]
    public async Task<IActionResult> GetPortfolioAllocation(Guid portfolioId)
    {
        var allocation = await _mediator.Send(new GetPortfolioAllocationQuery(portfolioId));
        return Ok(allocation);
    }
}