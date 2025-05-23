using BitBalance.Application.UserSettings.Command;
using BitBalance.Application.UserSettings.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BitBalance.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserSettingsController : ControllerBase
{
    private readonly IMediator _mediator;

    public UserSettingsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> Get(Guid userId)
    {
        var result = await _mediator.Send(new GetUserSettingsQuery(userId));
        return Ok(result);
    }

    [HttpPut("{userId}")]
    public async Task<IActionResult> Update(Guid userId, [FromBody] UpdateUserSettingsCommand command)
    {
        if (userId != command.UserId)
            return BadRequest();

        await _mediator.Send(command);
        return NoContent();
    }
}
