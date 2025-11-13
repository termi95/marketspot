using Backend.Services;
using Marketspot.Model;
using Marketspot.Model.Category;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController, Route("api/[controller]")]
    [Consumes("application/json"), Produces("application/json")]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    public class AddressController(AddressServices addressServices) : Controller
    {

        readonly AddressServices _addressServices = addressServices;

        [HttpPost, Authorize, Route("upsert"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> Upsert([FromBody] UpsertAddressDto dto)
        {
            string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var response = await _addressServices.Upsert(dto, userId);
            return StatusCode(response.GetStatusCode(), response);
        }

        [HttpPost, Authorize, Route("get"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> GettAddress()
        {
            string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var response = await _addressServices.GettAddress(userId);
            return StatusCode(response.GetStatusCode(), response);
        }
    }
}
