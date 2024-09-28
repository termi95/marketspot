using backend.Model.User;
using backend.Services;
using Marketspot.Model;
using Marketspot.Model.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController, Route("api/[controller]")]
    [Consumes("application/json"), Produces("application/json")]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    public class UserController(UserService userService) : Controller
    {
        readonly UserService _userService = userService;

        [HttpPost, Route("login"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> Login([FromBody] LoginUserDto user)
        {
            var response = await _userService.Login(user);
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Route("register"), ProducesResponseType<ApiResponse>(StatusCodes.Status201Created)]
        public async Task<ActionResult> Register([FromBody] RegisterUserDto user)
        {
            var response = await _userService.Register(user);
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Route("change-password-request"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> ChangePasswordRequest([FromBody] ChangePasswordRequestDto email)
        {
            var response = await _userService.ChangePasswordRequest(email);
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Route("change-password"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var response = await _userService.ChangePassword(dto);
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Authorize, Route("get-info"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetPersonalInfo()
        {
            string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var response = await _userService.GetPersonalInfo(userId);
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Authorize, Route("settings-change-password"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> UpdateSettingsChangePassword([FromBody] SettingsChangePasswordDto dto)
        {
            string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var response = await _userService.UpdateSettingsChangePassword(userId, dto);
            return StatusCode(response.GetStatusCode(), response);
        }
    }
}
