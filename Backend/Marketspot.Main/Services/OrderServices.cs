using Marketspot.DataAccess.Entities;
using Marketspot.Model;
using Marketspot.Model.Order;
using Marketspot.Validator;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Backend.Services
{
    public class OrderServices(UserDbContext context)
    {
        private readonly UserDbContext _context = context;
        public async Task<ApiResponse> CreateOrder(OrderDto dto, string userId)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            Guid guidUserId = Guid.Empty;
            if (!Guid.TryParse(userId,out guidUserId))
            {
                response.ErrorsMessages.Add("User not found");
                return response;
            }

            Offer offer = await _context.Offers.Include(o=>o.User).FirstOrDefaultAsync(x=>x.Id == Guid.Parse(dto.OfferId) && x.User.Id != guidUserId && x.IsBought == false);
            if (offer is null)
            {
                response.ErrorsMessages.Add("Offer not found");
                return response;
            }
            Address address = await _context.Addresses.FirstOrDefaultAsync(x => x.UserId == guidUserId && x.Id == Guid.Parse(dto.AddressId));
            if (address is null)
            {
                response.ErrorsMessages.Add("Address not found");
                return response;
            }
            Order order = new Order()
            {
                BuyerId = guidUserId,
                SellerId = offer.User.Id,
                OfferId = offer.Id,
                ShippingAddress = new ShippingAddressValue(address),
                PaymentMethod = Enum.Parse<PaymentMethod>(dto.PaymentMethod),
                DeliveryMethodIdDeliveryMethod = Enum.Parse<DeliveryMethod>(dto.DeliveryMethod)
            };

            try
            {
                offer.IsBought = true;
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                response.SetStatusCode(HttpStatusCode.OK);
                return response;
            }
            catch (Exception ex)
            {
                response.ErrorsMessages.Add(ex.InnerException is not null ? ex.InnerException.Message : ex.Message);
                return response;
            }
        }
    }
}
