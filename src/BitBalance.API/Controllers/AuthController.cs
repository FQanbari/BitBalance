//using MediatR;
//using Microsoft.AspNetCore.Mvc;

//namespace BitBalance.API.Controllers;

//[ApiController]
//[Route("api/[controller]")]
//public class AuthController : ControllerBase
//{
//    private readonly IMediator _mediator;

//    public AuthController(IMediator mediator)
//    {
//        _mediator = mediator;
//    }

//    [HttpPost("login")]
//    public async Task<IActionResult> Login([FromBody] LoginCommand command)
//    {
//        var token = await _mediator.Send(command);
//        if (token == null)
//            return Unauthorized();

//        return Ok(new { Token = token });
//    }

//    [HttpPost("register")]
//    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
//    {
//        var result = await _mediator.Send(command);
//        if (!result)
//            return BadRequest("Registration failed.");

//        return Ok();
//    }
//}