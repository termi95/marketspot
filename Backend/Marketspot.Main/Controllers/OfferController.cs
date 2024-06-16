using Backend.Services;
using Marketspot.Model;
using Marketspot.Model.Category;
using Marketspot.Validator.Validator.Offer;
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
    }
}
