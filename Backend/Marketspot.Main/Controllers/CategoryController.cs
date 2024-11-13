using Marketspot.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Backend.Services;
using Marketspot.Model.Category;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController, Route("api/[controller]")]
    [Consumes("application/json"), Produces("application/json")]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    public class CategoryController(CategoryServices categoryServices) : Controller
    {

        readonly CategoryServices _categoryServices = categoryServices;

        [HttpPost, Authorize, Route("Add"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> AddCategory([FromBody] AddCategoryDto dto)
        {
            string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var response = await _categoryServices.AddCategory(dto, userId);
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Route("GetCategoryByParentId"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetCategoryByParentId([FromBody] GetCategoryDto dto)
        {
            var response = await _categoryServices.GetCategoryByParentId(dto);
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Route("Delete"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> DeleteCategoryById([FromBody] DeleteCategoryDto dto)
        {
            string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var response = await _categoryServices.DeleteCategoryById(dto, userId);
            return StatusCode(response.GetStatusCode(), response);
        }
    }
}
