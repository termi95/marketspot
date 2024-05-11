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

        [HttpPost, Route("AddCategory"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> AddCategory([FromBody] LoginUserDto user)
        {
            var response = await _categoryServices.AddCategory();
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Route("GetCategoryByParentId"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetCategoryByParentId([FromBody] LoginUserDto user)
        {
            var response = await _categoryServices.GetCategoryByParentId(user);
            return StatusCode(response.GetStatusCode(), response);
        }
    }
}
