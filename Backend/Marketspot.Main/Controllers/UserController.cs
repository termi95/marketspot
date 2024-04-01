using backend.Model.User;
using backend.Services;
using Marketspot.Model;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    [ApiController]
    public class UserController(UserService userService) : Controller
    {
        private readonly UserService _userService = userService;

        [HttpPost, Route("login"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public ActionResult Post([FromBody] LoginUserDto user)
        {
            return Ok(_userService.Login(user));
        }

        [HttpPost, Route("register"), ProducesResponseType<ApiResponse>(StatusCodes.Status201Created)]
        public async Task<ActionResult> Post([FromBody] RegisterUserDto user)
        {
            var response = await _userService.Register(user);
            return StatusCode((int)response.StatusCode, response);
        }
    }
}
