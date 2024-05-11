using Marketspot.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Model.User;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController, Route("api/[controller]")]
    [Consumes("application/json"), Produces("application/json")]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    public class CategoryController(CategoryServices categoryServices) : Controller
    {

        readonly CategoryServices _categoryServices = categoryServices;

        [HttpPost, Route("login"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> Login([FromBody] LoginUserDto user)
        {
            var response = await _categoryServices.Login(user);
            return StatusCode(response.GetStatusCode(), response);
        }
    }
}
