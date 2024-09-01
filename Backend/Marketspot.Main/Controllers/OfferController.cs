using Backend.Services;
using Marketspot.Model;
using Marketspot.Model.Offer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Consumes("application/json"), Produces("application/json")]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    public class OfferController(OfferService offerServices) : ControllerBase
    {
        readonly OfferService _offerServices = offerServices;

        [HttpPost, Authorize, Route("Add"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> AddCategory([FromBody] AddOfferDto dto)
        {
            string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var response = await _offerServices.AddOffer(dto, userId);
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Route("Get-by-id"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK), ProducesResponseType<ApiResponse>(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> GetCategoryById([FromBody] GetOfferByIdDto dto)
        {
            var response = await _offerServices.GetOfferById(dto);
            return StatusCode(response.GetStatusCode(), response);
        }
    }
}
