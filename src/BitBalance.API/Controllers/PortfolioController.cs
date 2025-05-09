using BitBalance.Application.Commands;
using BitBalance.Application.Interfaces;
using BitBalance.Application.Queries;
using Microsoft.AspNetCore.Mvc;

namespace BitBalance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PortfolioController : ControllerBase
{
    private readonly IPortfolioService _portfolioService;

    public PortfolioController(IPortfolioService portfolioService)
    {
        _portfolioService = portfolioService;
    }

    [HttpGet("{portfolioId}/value")]
    public async Task<IActionResult> GetPortfolioValue(Guid portfolioId)
    {
        try
        {
            var result = await _portfolioService.GetPortfolioValueAsync(new GetPortfolioValueQuery { PortfolioId = portfolioId});
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{portfolioId}/assets")]
    public async Task<IActionResult> AddAsset(Guid portfolioId, [FromBody] CreateAssetCommand command)
    {
        try
        {
            command.PortfolioId = portfolioId;
            await _portfolioService.AddAssetAsync(command);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
