using Backend.Services;
using Marketspot.Model;
using Marketspot.Model.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController, Route("api/[controller]")]
    [Consumes("application/json"), Produces("application/json")]
    [ProducesResponseType<ApiResponse>(StatusCodes.Status400BadRequest)]
    public class OrderController(OrderServices orderServices) : Controller
    {

        readonly OrderServices _orderServices = orderServices;

        [HttpPost, Authorize, Route("create-order"), ProducesResponseType<ApiResponse>(StatusCodes.Status200OK)]
        public async Task<ActionResult> CreateOrder([FromBody] OrderDto dto)
        {
            string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var response = await _orderServices.CreateOrder(dto, userId);
            return StatusCode(response.GetStatusCode(), response);
        }
    }
}
