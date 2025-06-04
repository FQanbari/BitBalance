using BitBalance.API.Extensions;
using BitBalance.Application.UserSettings.Command;
using BitBalance.Application.UserSettings.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

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

    [HttpGet]
    public async Task<IActionResult> Get()
    {        
        var result = await _mediator.Send(new GetUserSettingsQuery(User.GetUserIdAsGuid()));
        return Ok(result);
    }

    [HttpPut("preferences")]
    public async Task<IActionResult> Update([FromBody] UpdateUserSettingsCommand command)
    {
        var modifiedCommand = command with { UserId = User.GetUserIdAsGuid() };
        await _mediator.Send(modifiedCommand);
        return NoContent();
    }
}
