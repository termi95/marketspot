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
    public class OfferController(OfferServices offerServices) : ControllerBase
    {
        readonly OfferServices _offerServices = offerServices;

        [HttpPost, Authorize, Route("Add"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> AddCategory([FromBody] AddOfferDto dto)
        {
            string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var response = await _offerServices.AddOffer(dto, userId);
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Authorize, Route("Update"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> Update([FromBody] UpdateOfferDto dto)
        {
            string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var response = await _offerServices.Update(dto, userId);
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Route("Get-by-id"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK), ProducesResponseType<ApiResponse>(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> GetOfferById([FromBody] GetOfferByIdDto dto)
        {
            string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var response = await _offerServices.GetOfferById(dto, userId);
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Route("Get-User-Offers"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetUSerOffer([FromBody] GetOffersByIdDto dto)
        {
            string id = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(dto.Id) && Guid.TryParse(dto.Id, out var userId))
            {
                id = userId.ToString();
            }

            var response = await _offerServices.GetUserOffers(id, HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Route("Get-recent"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetRecentOffers([FromBody] OfferQueryDto dto)
        {
            var response = await _offerServices.GetRecentOffers(dto, HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Authorize, Route("Soft-delete"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> SoftDelete([FromBody] SoftDeleteDto dto)
        {
            string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var response = await _offerServices.SoftDelete(dto, userId);
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Authorize, Route("get-checkout-offer"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetCheckoutOffer([FromBody] CheckoutOfferDto dto)
        {
            string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var response = await _offerServices.GetCheckoutOffer(dto, userId);
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Authorize, Route("get-bought"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetBoughtOffers()
        {
            string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var response = await _offerServices.GetBoughtOffers(userId);
            return StatusCode(response.GetStatusCode(), response);
        }
    }
}
