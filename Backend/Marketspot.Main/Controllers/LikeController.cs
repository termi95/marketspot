using Marketspot.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Backend.Services;
using System.Security.Claims;
using Marketspot.Model.Like;

namespace Backend.Controllers
{
    [ApiController, Route("api/[controller]")]
    [Consumes("application/json"), Produces("application/json")]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    public class LikeController(LikeServices likeServices) : Controller
    {

        readonly LikeServices _likeServices = likeServices;

        [HttpPost, Authorize, Route("Add"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> Add([FromBody] AddLikeDto dto)
        {
            string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var response = await _likeServices.Add(dto, userId);
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Authorize, Route("Delete"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> DeleteLike([FromBody] DeleteLikeDto dto)
        {
            string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var response = await _likeServices.Delete(dto, userId);
            return StatusCode(response.GetStatusCode(), response);
        }
    }
}
