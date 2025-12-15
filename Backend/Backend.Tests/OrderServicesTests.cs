using AutoMapper;
using Backend.Services;
using Marketspot.DataAccess.Entities;
using Marketspot.Model.Order;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Tests
{
    public class OrderServicesTests
    {
        private UserDbContext CreateInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<UserDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new UserDbContext(options);
        }

        private IMapper CreateMapper()
        {
            var loggerFactory = LoggerFactory.Create(builder => { });
            MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MappingConfig>();
            }, loggerFactory);

            return config.CreateMapper();
        }
        [Fact]
        public async Task CreateOrder_ShouldReturnValidationError_WhenDtoIsInvalid()
        {
            using var context = CreateInMemoryContext();
            var service = new OrderServices(context);

            var dto = new OrderDto
            {
                OfferId = "",
                AddressId = "",
                PaymentMethod = "",
                DeliveryMethod = ""
            };

            var response = await service.CreateOrder(dto, Guid.NewGuid().ToString());

            Assert.False(response.IsSuccess);
            Assert.True(response.IsValidationError);
            Assert.NotEmpty(response.ErrorsMessages);
            Assert.Null(response.Result);
        }

        [Fact]
        public async Task CreateOrder_ShouldReturnError_WhenUserIdIsNotGuid()
        {
            using var context = CreateInMemoryContext();
            var service = new OrderServices(context);

            var dto = new OrderDto
            {
                OfferId = Guid.NewGuid().ToString(),
                AddressId = Guid.NewGuid().ToString(),
                PaymentMethod = "Card",
                DeliveryMethod = "Dpd"
            };

            var response = await service.CreateOrder(dto, "not-a-guid");

            Assert.False(response.IsSuccess);
            Assert.False(response.IsValidationError);
            Assert.NotEmpty(response.ErrorsMessages);
            Assert.Contains("User was not found", response.ErrorsMessages);
        }

        [Fact]
        public async Task CreateOrder_ShouldReturnError_WhenOfferNotFound()
        {
            using var context = CreateInMemoryContext();
            var service = new OrderServices(context);

            var buyerId = Guid.NewGuid();

            var dto = new OrderDto
            {
                OfferId = Guid.NewGuid().ToString(),
                AddressId = Guid.NewGuid().ToString(),
                PaymentMethod = "Card",
                DeliveryMethod = "Dpd"
            };

            var response = await service.CreateOrder(dto, buyerId.ToString());

            Assert.False(response.IsSuccess);
            Assert.False(response.IsValidationError);
            Assert.NotEmpty(response.ErrorsMessages);
            Assert.Contains("Offer was not found.", response.ErrorsMessages);
        }

        [Fact]
        public async Task CreateOrder_ShouldReturnError_WhenBuyerTriesToBuyOwnOffer()
        {
            using var context = CreateInMemoryContext();
            var service = new OrderServices(context);

            var buyerId = Guid.NewGuid();

            var buyer = new User
            {
                Id = buyerId,
                Email = "buyer@test.pl",
                Name = "Buyer",
                Surname = "Buyer",
                Password = "hash"
            };

            var offer = new Offer
            {
                Id = Guid.NewGuid(),
                User = buyer,
                IsBought = false,
                SoftDeletedDate = null,
                Photos = new List<string>(),
                Tittle = "Offer",
                Description = "Desc",
                Price = 10,
                CreationDate = DateTime.Now
            };

            context.Users.Add(buyer);
            context.Offers.Add(offer);
            await context.SaveChangesAsync();

            var dto = new OrderDto
            {
                OfferId = offer.Id.ToString(),
                AddressId = Guid.NewGuid().ToString(),
                PaymentMethod = "Card",
                DeliveryMethod = "Dpd"
            };

            var response = await service.CreateOrder(dto, buyerId.ToString());

            Assert.False(response.IsSuccess);
            Assert.NotEmpty(response.ErrorsMessages);
            Assert.Contains("Offer was not found.", response.ErrorsMessages);

            var dbOffer = await context.Offers.AsNoTracking().SingleAsync(o => o.Id == offer.Id);
            Assert.False(dbOffer.IsBought);
            Assert.Equal(0, await context.Orders.CountAsync());
        }

        [Fact]
        public async Task CreateOrder_ShouldReturnError_WhenOfferAlreadyBought()
        {
            using var context = CreateInMemoryContext();
            var service = new OrderServices(context);

            var buyerId = Guid.NewGuid();
            var sellerId = Guid.NewGuid();

            var seller = new User
            {
                Id = sellerId,
                Email = "seller@test.pl",
                Name = "Seller",
                Surname = "Seller",
                Password = "hash"
            };

            var offer = new Offer
            {
                Id = Guid.NewGuid(),
                User = seller,
                IsBought = true,
                SoftDeletedDate = null,
                Photos = new List<string>(),
                Tittle = "Offer",
                Description = "Desc",
                Price = 10,
                CreationDate = DateTime.Now
            };

            context.Users.Add(seller);
            context.Offers.Add(offer);
            await context.SaveChangesAsync();

            var dto = new OrderDto
            {
                OfferId = offer.Id.ToString(),
                AddressId = Guid.NewGuid().ToString(),
                PaymentMethod = "Card",
                DeliveryMethod = "Dpd"
            };

            var response = await service.CreateOrder(dto, buyerId.ToString());

            Assert.False(response.IsSuccess);
            Assert.NotEmpty(response.ErrorsMessages);
            Assert.Contains("Offer was not found.", response.ErrorsMessages);
            var count = await context.Orders.CountAsync();
            Assert.Equal(0, count);
        }

        [Fact]
        public async Task CreateOrder_ShouldReturnError_WhenAddressNotFound()
        {
            using var context = CreateInMemoryContext();
            var service = new OrderServices(context);

            var buyerId = Guid.NewGuid();
            var sellerId = Guid.NewGuid();

            var seller = new User
            {
                Id = sellerId,
                Email = "seller@test.pl",
                Name = "Seller",
                Surname = "Seller",
                Password = "hash"
            };

            var offer = new Offer
            {
                Id = Guid.NewGuid(),
                User = seller,
                IsBought = false,
                SoftDeletedDate = null,
                Photos = new List<string>(),
                Tittle = "Offer",
                Description = "Desc",
                Price = 10,
                CreationDate = DateTime.Now
            };

            context.Users.Add(seller);
            context.Offers.Add(offer);
            await context.SaveChangesAsync();

            var dto = new OrderDto
            {
                OfferId = offer.Id.ToString(),
                AddressId = Guid.NewGuid().ToString(),
                PaymentMethod = "Card",
                DeliveryMethod = "Dpd"
            };

            var response = await service.CreateOrder(dto, buyerId.ToString());

            Assert.False(response.IsSuccess);
            Assert.NotEmpty(response.ErrorsMessages);
            Assert.Contains("Address was not found.", response.ErrorsMessages);

            var dbOffer = await context.Offers.AsNoTracking().SingleAsync(o => o.Id == offer.Id);
            Assert.False(dbOffer.IsBought);
            Assert.Equal(0, await context.Orders.CountAsync());
        }

        [Fact]
        public async Task CreateOrder_ShouldCreateOrder_AndMarkOfferAsBought_WhenDataIsValid()
        {
            using var context = CreateInMemoryContext();
            var service = new OrderServices(context);

            var buyerId = Guid.NewGuid();
            var sellerId = Guid.NewGuid();

            var buyer = new User
            {
                Id = buyerId,
                Email = "buyer@test.pl",
                Name = "Buyer",
                Surname = "Buyer",
                Password = "hash"
            };

            var seller = new User
            {
                Id = sellerId,
                Email = "seller@test.pl",
                Name = "Seller",
                Surname = "Seller",
                Password = "hash"
            };

            var offer = new Offer
            {
                Id = Guid.NewGuid(),
                User = seller,
                IsBought = false,
                SoftDeletedDate = null,
                Photos = new List<string>(),
                Tittle = "Offer",
                Description = "Desc",
                Price = 10,
                CreationDate = DateTime.Now
            };

            var address = new Address
            {
                Id = Guid.NewGuid(),
                UserId = buyerId,
                Name = "Home",
                City = "Warsaw",
                Country = "PL",
                Phone = "123",
                Street = "Street 1"
            };

            context.Users.AddRange(buyer, seller);
            context.Offers.Add(offer);
            context.Addresses.Add(address);
            await context.SaveChangesAsync();

            var dto = new OrderDto
            {
                OfferId = offer.Id.ToString(),
                AddressId = address.Id.ToString(),
                PaymentMethod = "Card",
                DeliveryMethod = "Dpd"
            };

            var response = await service.CreateOrder(dto, buyerId.ToString());

            Assert.True(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.OK, response.GetStatusCode());
            Assert.Empty(response.ErrorsMessages);

            var dbOffer = await context.Offers.AsNoTracking().SingleAsync(o => o.Id == offer.Id);
            Assert.True(dbOffer.IsBought);

            Assert.Equal(1, await context.Orders.CountAsync());
            var order = await context.Orders.AsNoTracking().SingleAsync();
            Assert.Equal(buyerId, order.BuyerId);
            Assert.Equal(sellerId, order.SellerId);
            Assert.Equal(offer.Id, order.OfferId);
        }
    }
}
