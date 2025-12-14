using AutoMapper;
using Backend.Services;
using Marketspot.DataAccess.Entities;
using Marketspot.Model.Like;
using Marketspot.Model.Offer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Net;

namespace Backend.Tests
{
    public class LikeServicesTests
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
        public async Task Add_ShouldReturnValidationError_WhenDtoIsInvalid()
        {
            using var context = CreateInMemoryContext();
            var service = new LikeServices(context, CreateMapper());

            var dto = new AddLikeDto
            {
                OfferId = ""
            };

            var response = await service.Add(dto, Guid.NewGuid().ToString());

            Assert.False(response.IsSuccess);
            Assert.True(response.IsValidationError);
            Assert.NotEmpty(response.ErrorsMessages);
            Assert.Null(response.Result);

            Assert.Equal(0, await context.Likes.CountAsync());
        }

        [Fact]
        public async Task Add_ShouldReturnError_WhenOfferDoesNotExist()
        {
            using var context = CreateInMemoryContext();
            var service = new LikeServices(context, CreateMapper());

            var userId = Guid.NewGuid().ToString();
            var dto = new AddLikeDto { OfferId = Guid.NewGuid().ToString() };

            var response = await service.Add(dto, userId);

            Assert.False(response.IsSuccess);
            Assert.False(response.IsValidationError);
            Assert.NotEmpty(response.ErrorsMessages);
            Assert.Contains("Offer not exist or is not active", response.ErrorsMessages);

            Assert.Equal(0, await context.Likes.CountAsync());
        }

        [Fact]
        public async Task Add_ShouldReturnError_WhenOfferIsSoftDeleted()
        {
            using var context = CreateInMemoryContext();
            var service = new LikeServices(context, CreateMapper());

            var userId = Guid.NewGuid();

            var offer = new Offer
            {
                Id = Guid.NewGuid(),
                Tittle = "Offer",
                Description = "Desc",
                SoftDeletedDate = DateTime.Now, // soft deleted
                Photos = [],
                IsBought = false
            };
            context.Offers.Add(offer);
            await context.SaveChangesAsync();

            var dto = new AddLikeDto { OfferId = offer.Id.ToString() };

            var response = await service.Add(dto, userId.ToString());

            Assert.False(response.IsSuccess);
            Assert.NotEmpty(response.ErrorsMessages);
            Assert.Contains("Offer not exist or is not active", response.ErrorsMessages);

            Assert.Equal(0, await context.Likes.CountAsync());
        }

        [Fact]
        public async Task Add_ShouldReturnError_WhenUserAlreadyLikedOffer()
        {
            using var context = CreateInMemoryContext();
            var service = new LikeServices(context, CreateMapper());

            var userId = Guid.NewGuid();

            var user = new User
            {
                Id = userId,
                Email = "jan@example.com",
                Name = "Jan",
                Surname = "Kowalski",
                Password = "hash"
            };

            var offer = new Offer
            {
                Id = Guid.NewGuid(),
                Tittle = "Offer",
                Description = "Desc",
                SoftDeletedDate = null,
                Photos = [],
                IsBought = false
            };

            context.Users.Add(user);
            context.Offers.Add(offer);
            await context.SaveChangesAsync();

            context.Likes.Add(new Like { Id = Guid.NewGuid(), OfferId = offer.Id, UserId = userId });
            await context.SaveChangesAsync();

            var dto = new AddLikeDto { OfferId = offer.Id.ToString() };

            var response = await service.Add(dto, userId.ToString());

            Assert.False(response.IsSuccess);
            Assert.NotEmpty(response.ErrorsMessages);
            Assert.Contains("You already like this offer.", response.ErrorsMessages);

            Assert.Equal(1, await context.Likes.CountAsync());
        }

        [Fact]
        public async Task Add_ShouldCreateLike_WhenDataIsValid()
        {
            using var context = CreateInMemoryContext();
            var service = new LikeServices(context, CreateMapper());

            var userId = Guid.NewGuid();

            var user = new User
            {
                Id = userId,
                Email = "jan@example.com",
                Name = "Jan",
                Surname = "Kowalski",
                Password = "hash"
            };

            var offer = new Offer
            {
                Id = Guid.NewGuid(),
                Tittle = "Offer",
                Description = "Desc",
                SoftDeletedDate = null,
                Photos = [],
                IsBought = false
            };

            context.Users.Add(user);
            context.Offers.Add(offer);
            await context.SaveChangesAsync();

            var dto = new AddLikeDto { OfferId = offer.Id.ToString() };

            var response = await service.Add(dto, userId.ToString());

            Assert.True(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.Created, response.GetStatusCode());
            Assert.Empty(response.ErrorsMessages);
            Assert.NotNull(response.Result);
            Assert.IsType<Guid>(response.Result);

            Assert.Equal(1, await context.Likes.CountAsync());
            var created = await context.Likes.SingleAsync();
            Assert.Equal(userId, created.UserId);
            Assert.Equal(offer.Id, created.OfferId);
        }

        [Fact]
        public async Task Delete_ShouldReturnValidationError_WhenDtoIsInvalid()
        {
            using var context = CreateInMemoryContext();
            var service = new LikeServices(context, CreateMapper());

            var dto = new DeleteLikeDto { Id = "" };

            var response = await service.Delete(dto, Guid.NewGuid().ToString());

            Assert.False(response.IsSuccess);
            Assert.True(response.IsValidationError);
            Assert.NotEmpty(response.ErrorsMessages);
        }

        [Fact]
        public async Task Delete_ShouldReturnNotFound_WhenLikeDoesNotExistForUser()
        {
            using var context = CreateInMemoryContext();
            var service = new LikeServices(context, CreateMapper());

            var dto = new DeleteLikeDto { Id = Guid.NewGuid().ToString() };
            var response = await service.Delete(dto, Guid.NewGuid().ToString());

            Assert.False(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.NotFound, response.GetStatusCode());
            Assert.NotEmpty(response.ErrorsMessages);
            Assert.Contains("Like not found for that user.", response.ErrorsMessages);
        }

        [Fact]
        public async Task Delete_ShouldDeleteLike_WhenLikeExistsForUser()
        {
            using var context = CreateInMemoryContext();
            var service = new LikeServices(context, CreateMapper());

            var userId = Guid.NewGuid();
            var offerId = Guid.NewGuid();
            var likeId = Guid.NewGuid();

            context.Likes.Add(new Like { Id = likeId, UserId = userId, OfferId = offerId });
            await context.SaveChangesAsync();

            var dto = new DeleteLikeDto { Id = likeId.ToString() };

            var response = await service.Delete(dto, userId.ToString());

            Assert.True(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.OK, response.GetStatusCode());
            Assert.Empty(response.ErrorsMessages);

            Assert.Equal(0, await context.Likes.CountAsync());
        }
        [Fact]
        public async Task GettAllLiked_ShouldReturnOnlyNotBoughtOffers_ForUser()
        {
            using var context = CreateInMemoryContext();
            var service = new LikeServices(context, CreateMapper());

            var userId = Guid.NewGuid();

            var user = new User
            {
                Id = userId,
                Email = "jan@example.com",
                Name = "Jan",
                Surname = "Kowalski",
                Password = "hash"
            };

            var offerNotBought = new Offer
            {
                Id = Guid.NewGuid(),
                SoftDeletedDate = null,
                IsBought = false,
                Tittle = "Offer 1",
                Description = "Desc",
                Price = 10,
                CreationDate = DateTime.Now,
                Photos = [],
                User = user
            };

            var offerBought = new Offer
            {
                Id = Guid.NewGuid(),
                SoftDeletedDate = null,
                IsBought = true,
                Tittle = "Offer 2",
                Description = "Desc",
                Price = 20,
                CreationDate = DateTime.Now,
                Photos = [],
                User = user
            };

            context.Users.Add(user);
            context.Offers.AddRange(offerNotBought, offerBought);
            await context.SaveChangesAsync();

            context.Likes.AddRange(
                new Like { Id = Guid.NewGuid(), UserId = userId, OfferId = offerNotBought.Id },
                new Like { Id = Guid.NewGuid(), UserId = userId, OfferId = offerBought.Id }
            );
            await context.SaveChangesAsync();

            var response = await service.GettAllLiked(userId.ToString());

            Assert.True(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.OK, response.GetStatusCode());
            Assert.Empty(response.ErrorsMessages);
            Assert.NotNull(response.Result);

            var list = Assert.IsType<List<GetUserOffers>>(response.Result);
            Assert.Single(list);
            Assert.Equal(offerNotBought.Id, list[0].Id);
        }

    }
}
