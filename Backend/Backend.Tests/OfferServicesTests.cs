using AutoMapper;
using Backend.Services;
using Marketspot.DataAccess.Entities;
using Marketspot.Model;
using Marketspot.Model.Offer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Net;
using EntityCondytion = Marketspot.DataAccess.Entities.Condytion;
using EntityDeliveryType = Marketspot.DataAccess.Entities.DeliveryType;

using DtoCondytion = Marketspot.Model.Offer.Condytion;
using DtoDeliveryType = Marketspot.Model.Offer.DeliveryType;


namespace Backend.Tests
{
    public class OfferServicesTests
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

        private static IPasswordHasher<User> CreatePasswordHasher() => new PasswordHasher<User>();

        private static User NewUser(string email = "jan@example.com")
            => new User
            {
                Id = Guid.NewGuid(),
                Name = "Jan",
                Surname = "Kowalski",
                Email = email,
                Password = "HASH"
            };

        private static Category NewCategory(string name = "Cat")
            => new Category
            {
                Id = Guid.NewGuid(),
                Name = name,
                ParentId = Guid.Empty
            };

        private static Offer NewOffer(User user, Category category, int price = 100, bool isBought = false, DateTime? softDeleted = null)
            => new Offer
            {
                Id = Guid.NewGuid(),
                Tittle = "Offer title",
                Description = "Offer description",
                Price = price,
                Photos = new List<string> { "p1.jpg" },
                IconPhoto = "p1.jpg",
                Condytion = EntityCondytion.New,
                DeliveryType = EntityDeliveryType.Shipping,
                PickupAddress = null,
                CreationDate = new DateTime(2025, 1, 1),
                User = user,
                Category = category,
                Likes = new List<Like>(),
                IsBought = isBought,
                SoftDeletedDate = softDeleted
            };

        private static Like NewLike(User liker, Offer offer)
            => new Like
            {
                Id = Guid.NewGuid(),
                UserId = liker.Id,
                OfferId = offer.Id,
                User = liker,
                Offer = offer,
                CreatedDate = new DateTime(2025, 1, 2)
            };

        private static Address NewAddress(User user)
            => new Address
            {
                Id = Guid.NewGuid(),
                Name = "Home",
                Street = "Main 1",
                City = "Warsaw",
                Country = "PL",
                Phone = "123456789",
                UserId = user.Id,
                User = user
            };

        private OfferServices CreateService(UserDbContext ctx)
        {
            var mapper = CreateMapper();
            var hasher = CreatePasswordHasher();
            return new OfferServices(ctx, hasher, mapper);
        }

        #region AddOffer

        [Fact]
        public async Task AddOffer_ShouldCreateOffer_WhenDataIsValid()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var user = NewUser();
            var category = NewCategory();
            ctx.Users.Add(user);
            ctx.Categories.Add(category);
            await ctx.SaveChangesAsync();

            var dto = new AddOfferDto
            {
                Tittle = "Nowa oferta",
                Description = "Opis",
                Price = 123,
                Photos = new List<string> { "a.jpg", "b.jpg" },
                CategoryId = category.Id.ToString(),
                Condytion = Marketspot.Model.Offer.Condytion.New,
                DeliveryType = Marketspot.Model.Offer.DeliveryType.Shipping,
                PickupAddress = new Marketspot.Model.Offer.PickupAddress()
            };

            ApiResponse response = await service.AddOffer(dto, user.Id.ToString());

            Assert.True(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.Created, response.GetStatusCode());
            Assert.False(response.IsValidationError);
            Assert.NotNull(response.Result);

            var createdId = Assert.IsType<Guid>(response.Result);

            var created = await ctx.Offers
                .Include(o => o.User)
                .Include(o => o.Category)
                .SingleAsync(o => o.Id == createdId);

            Assert.Equal(user.Id, created.User.Id);
            Assert.Equal(category.Id, created.Category.Id);
            Assert.Equal("a.jpg", created.IconPhoto); // MappingConfig: IconPhoto = first photo
            Assert.Equal(123, created.Price);
            Assert.Equal("Nowa oferta", created.Tittle);
        }

        [Fact]
        public async Task AddOffer_ShouldReturnValidationError_WhenTitleIsTooShort()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var user = NewUser();
            var category = NewCategory();
            ctx.Users.Add(user);
            ctx.Categories.Add(category);
            await ctx.SaveChangesAsync();

            var dto = new AddOfferDto
            {
                Tittle = "aa", // < 3
                Description = "Opis",
                Price = 10,
                Photos = new List<string> { "a.jpg" },
                CategoryId = category.Id.ToString(),
                Condytion = Marketspot.Model.Offer.Condytion.New,
                DeliveryType = Marketspot.Model.Offer.DeliveryType.Shipping,
                PickupAddress = new Marketspot.Model.Offer.PickupAddress()
            };

            ApiResponse response = await service.AddOffer(dto, user.Id.ToString());

            Assert.False(response.IsSuccess);
            Assert.True(response.IsValidationError);
            Assert.Equal(400, response.GetStatusCode());
            Assert.NotEmpty(response.ErrorsMessages);

            Assert.Empty(ctx.Offers.ToList());
        }

        [Fact]
        public async Task AddOffer_ShouldReturnError_WhenUserOrCategoryNotFound()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            // user exists, category missing
            var user = NewUser();
            ctx.Users.Add(user);
            await ctx.SaveChangesAsync();

            var dto = new AddOfferDto
            {
                Tittle = "Poprawna oferta",
                Description = "Opis",
                Price = 10,
                Photos = new List<string> { "a.jpg" },
                CategoryId = Guid.NewGuid().ToString(), // not in DB
                Condytion = Marketspot.Model.Offer.Condytion.New,
                DeliveryType = Marketspot.Model.Offer.DeliveryType.Shipping,
                PickupAddress = new Marketspot.Model.Offer.PickupAddress()
            };

            ApiResponse response = await service.AddOffer(dto, user.Id.ToString());

            Assert.False(response.IsSuccess);
            Assert.False(response.IsValidationError);
            Assert.Contains("User or Category not found", response.ErrorsMessages);
        }

        [Fact]
        public async Task AddOffer_ShouldRequirePickupAddressFields_WhenLocalPickup()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var user = NewUser();
            var category = NewCategory();
            ctx.Users.Add(user);
            ctx.Categories.Add(category);
            await ctx.SaveChangesAsync();

            var dto = new AddOfferDto
            {
                Tittle = "Oferta odbiór",
                Description = "Opis",
                Price = 10,
                Photos = new List<string> { "a.jpg" },
                CategoryId = category.Id.ToString(),
                Condytion = Marketspot.Model.Offer.Condytion.New,
                DeliveryType = Marketspot.Model.Offer.DeliveryType.LocalPickup,
                PickupAddress = new Marketspot.Model.Offer.PickupAddress
                {
                    Street = "", // invalid
                    City = "",
                    Phone = ""
                }
            };

            ApiResponse response = await service.AddOffer(dto, user.Id.ToString());

            Assert.False(response.IsSuccess);
            Assert.True(response.IsValidationError);
            Assert.NotEmpty(response.ErrorsMessages);

            Assert.Contains("Street is required for local pickup.",response.ErrorsMessages);
            Assert.Contains("City is required for local pickup.",response.ErrorsMessages);
            Assert.Contains("Phone is required for local pickup.",response.ErrorsMessages);
        }

        #endregion

        #region Update

        [Fact]
        public async Task Update_ShouldUpdateOffer_WhenUserIsOwner_AndOfferNotBought()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var user = NewUser();
            var cat1 = NewCategory("Cat1");
            var cat2 = NewCategory("Cat2");

            ctx.Users.Add(user);
            ctx.Categories.AddRange(cat1, cat2);

            var offer = NewOffer(user, cat1, price: 50, isBought: false);
            ctx.Offers.Add(offer);

            await ctx.SaveChangesAsync();

            var dto = new UpdateOfferDto
            {
                Id = offer.Id.ToString(),
                Tittle = "Zmieniony tytuł",
                Description = "Zmieniony opis",
                Price = 999,
                Photos = new List<string> { "x.jpg", "y.jpg" },
                CategoryId = cat2.Id.ToString(),
                Condytion = Marketspot.Model.Offer.Condytion.Used,
                DeliveryType = Marketspot.Model.Offer.DeliveryType.Shipping,
                PickupAddress = new Marketspot.Model.Offer.PickupAddress()
            };

            ApiResponse response = await service.Update(dto, user.Id.ToString());

            Assert.True(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.Created, response.GetStatusCode());

            var updated = await ctx.Offers.Include(o => o.Category).SingleAsync(o => o.Id == offer.Id);
            Assert.Equal("Zmieniony tytuł", updated.Tittle);
            Assert.Equal("Zmieniony opis", updated.Description);
            Assert.Equal(999, updated.Price);
            Assert.Equal(cat2.Id, updated.Category.Id);
            Assert.Equal("x.jpg", updated.IconPhoto); // bazuje na Photos[0] przy mapowaniu AddOfferDto->Offer (Update dziedziczy)
        }

        [Fact]
        public async Task Update_ShouldReturnNotFound_WhenOfferIsNotOwnedByUser()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var owner = NewUser("owner@test.pl");
            var other = NewUser("other@test.pl");
            var cat = NewCategory();

            ctx.Users.AddRange(owner, other);
            ctx.Categories.Add(cat);

            var offer = NewOffer(owner, cat);
            ctx.Offers.Add(offer);

            await ctx.SaveChangesAsync();

            var dto = new UpdateOfferDto
            {
                Id = offer.Id.ToString(),
                Tittle = "Zmiana",
                Description = "Zmiana",
                Price = 1,
                Photos = new List<string> { "a.jpg" },
                CategoryId = cat.Id.ToString(),
                Condytion = Marketspot.Model.Offer.Condytion.New,
                DeliveryType = Marketspot.Model.Offer.DeliveryType.Shipping,
                PickupAddress = new Marketspot.Model.Offer.PickupAddress()
            };

            ApiResponse response = await service.Update(dto, other.Id.ToString());

            Assert.False(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.NotFound, response.GetStatusCode());
            Assert.Contains("Offer was not found.", response.ErrorsMessages);
        }

        [Fact]
        public async Task Update_ShouldReturnError_WhenOfferIsBought()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var user = NewUser();
            var cat = NewCategory();

            ctx.Users.Add(user);
            ctx.Categories.Add(cat);

            var offer = NewOffer(user, cat, isBought: true);
            ctx.Offers.Add(offer);

            await ctx.SaveChangesAsync();

            var dto = new UpdateOfferDto
            {
                Id = offer.Id.ToString(),
                Tittle = "Zmiana",
                Description = "Zmiana",
                Price = 1,
                Photos = new List<string> { "a.jpg" },
                CategoryId = cat.Id.ToString(),
                Condytion = Marketspot.Model.Offer.Condytion.New,
                DeliveryType = Marketspot.Model.Offer.DeliveryType.Shipping,
                PickupAddress = new Marketspot.Model.Offer.PickupAddress()
            };

            ApiResponse response = await service.Update(dto, user.Id.ToString());

            Assert.False(response.IsSuccess);
            Assert.False(response.IsValidationError);
            Assert.Contains("You can't edit offer that is bought.", response.ErrorsMessages);
        }

        #endregion

        #region GetOfferById

        [Fact]
        public async Task GetOfferById_ShouldReturnNotFound_WhenOfferSoftDeleted()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var user = NewUser();
            var cat = NewCategory();
            ctx.Users.Add(user);
            ctx.Categories.Add(cat);

            var offer = NewOffer(user, cat, softDeleted: DateTime.Now);
            ctx.Offers.Add(offer);
            await ctx.SaveChangesAsync();

            var dto = new GetOfferByIdDto { Id = offer.Id.ToString() };

            ApiResponse response = await service.GetOfferById(dto, user.Id.ToString());

            Assert.False(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.NotFound, response.GetStatusCode());
            Assert.Contains("Offer was not found.", response.ErrorsMessages);
        }

        [Fact]
        public async Task GetOfferById_ShouldReturnOffer_WithLikeId_WhenUserLiked()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var owner = NewUser("owner@test.pl");
            var liker = NewUser("liker@test.pl");
            var cat = NewCategory();

            ctx.Users.AddRange(owner, liker);
            ctx.Categories.Add(cat);

            var offer = NewOffer(owner, cat);
            ctx.Offers.Add(offer);

            var like = NewLike(liker, offer);
            ctx.Likes.Add(like);

            await ctx.SaveChangesAsync();

            var dto = new GetOfferByIdDto { Id = offer.Id.ToString() };
            ApiResponse response = await service.GetOfferById(dto, liker.Id.ToString());

            Assert.True(response.IsSuccess);
            Assert.Equal(200, response.GetStatusCode());

            var result = Assert.IsType<GetOfferByIdResult>(response.Result);
            Assert.Equal(like.Id, result.LikeId);
        }

        [Fact]
        public async Task GetOfferById_ShouldReturnOffer_WithEmptyLikeId_WhenUserIdIsEmpty()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var owner = NewUser("owner@test.pl");
            var cat = NewCategory();
            ctx.Users.Add(owner);
            ctx.Categories.Add(cat);

            var offer = NewOffer(owner, cat);
            ctx.Offers.Add(offer);

            await ctx.SaveChangesAsync();

            var dto = new GetOfferByIdDto { Id = offer.Id.ToString() };
            ApiResponse response = await service.GetOfferById(dto, "");

            Assert.True(response.IsSuccess);
            Assert.Equal(200, response.GetStatusCode());

            var result = Assert.IsType<GetOfferByIdResult>(response.Result);
            Assert.Equal(Guid.Empty, result.LikeId);
        }

        #endregion

        #region GetUserOffers

        [Fact]
        public async Task GetUserOffers_ShouldReturnOnlyNotBoughtAndNotDeleted_WithIsLiked()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var seller = NewUser("seller@test.pl");
            var login = NewUser("login@test.pl");
            var cat = NewCategory();

            ctx.Users.AddRange(seller, login);
            ctx.Categories.Add(cat);
            await ctx.SaveChangesAsync();

            var sellerTracked = ctx.Users.Single(x => x.Id == seller.Id);
            var catTracked = ctx.Categories.Single(x => x.Id == cat.Id);

            var active = NewOffer(sellerTracked, catTracked, isBought: false, softDeleted: null);
            var bought = NewOffer(sellerTracked, catTracked, isBought: true, softDeleted: null);
            var deleted = NewOffer(sellerTracked, catTracked, isBought: false, softDeleted: DateTime.Now);

            ctx.Offers.AddRange(active, bought, deleted);

            var like = NewLike(login, active);
            ctx.Likes.Add(like);

            await ctx.SaveChangesAsync();

            ApiResponse response = await service.GetUserOffers(seller.Id.ToString(), login.Id.ToString());

            Assert.True(response.IsSuccess);
            Assert.Equal(200, response.GetStatusCode());

            var list = Assert.IsType<List<GetUserOffers>>(response.Result);

            Assert.Single(list);
            Assert.True(list[0].IsLiked);
            Assert.Equal(like.Id, list[0].LikeId);
            Assert.Equal(seller.Id, list[0].UserId);
        }


        #endregion

        #region GetCheckoutOffer

        [Fact]
        public async Task GetCheckoutOffer_ShouldReturnCheckout_WhenOfferExists()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var user = NewUser();
            var cat = NewCategory();
            ctx.Users.Add(user);
            ctx.Categories.Add(cat);

            var offer = NewOffer(user, cat, price: 321);
            offer.IconPhoto = "photo.jpg";
            offer.CreationDate = new DateTime(2025, 2, 1);
            ctx.Offers.Add(offer);

            await ctx.SaveChangesAsync();

            var dto = new CheckoutOfferDto { Id = offer.Id.ToString() };

            ApiResponse response = await service.GetCheckoutOffer(dto, user.Id.ToString());

            Assert.True(response.IsSuccess);
            Assert.Equal(200, response.GetStatusCode());

            var checkout = Assert.IsType<Checkout>(response.Result);
            Assert.Equal(offer.Id, checkout.Id);
            Assert.Equal("photo.jpg", checkout.Photo);
            Assert.Equal(321, checkout.Price);
        }

        [Fact]
        public async Task GetCheckoutOffer_ShouldReturnNotFound_WhenOfferDoesNotExist()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var dto = new CheckoutOfferDto { Id = Guid.NewGuid().ToString() };

            ApiResponse response = await service.GetCheckoutOffer(dto, Guid.NewGuid().ToString());

            Assert.False(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.NotFound, response.GetStatusCode());
            Assert.Contains("Offer not found", response.ErrorsMessages);
        }

        #endregion

        #region GetRecentOffers (InMemory-safe branch)

        [Fact]
        public async Task GetRecentOffers_ShouldReturnPagedResults_WhenNoCategoryAndNoSearchText()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var user = NewUser();
            var cat = NewCategory();
            ctx.Users.Add(user);
            ctx.Categories.Add(cat);

            // 5 offers, 1 bought should be filtered out
            var offers = new List<Offer>
            {
                NewOffer(user, cat, price: 10, isBought:false),
                NewOffer(user, cat, price: 20, isBought:false),
                NewOffer(user, cat, price: 30, isBought:false),
                NewOffer(user, cat, price: 40, isBought:false),
                NewOffer(user, cat, price: 50, isBought:true),
            };

            // ustaw daty rosnąco, żeby sort default był deterministyczny
            for (int i = 0; i < offers.Count; i++)
                offers[i].CreationDate = new DateTime(2025, 1, 1).AddDays(i);

            ctx.Offers.AddRange(offers);
            await ctx.SaveChangesAsync();

            var dto = new OfferQueryDto
            {
                Page = 1,
                ItemPerPage = 2,
                CategoryId = Guid.Empty.ToString(), // ważne: omija SQL CTE
                SearchText = null,                  // ważne: omija FTS
                MinPrice = null,
                MaxPrice = null,
                DeliveryType = new List<int>(),
                Condytion = new List<int>(),
                SortBy = "CreatedDateDesc"
            };

            ApiResponse response = await service.GetRecentOffers(dto, user.Id.ToString());

            Assert.True(response.IsSuccess);
            Assert.Equal(200, response.GetStatusCode());

            var list = Assert.IsType<List<GetUserOffers>>(response.Result);
            Assert.Equal(2, list.Count); // page size
        }

        #endregion

        #region SoftDelete (preconditions)

        [Fact]
        public async Task SoftDelete_ShouldReturnError_WhenUserNotFound()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var dto = new SoftDeleteDto
            {
                Id = Guid.NewGuid().ToString(),
                Password = "any"
            };

            ApiResponse response = await service.SoftDelete(dto, Guid.NewGuid().ToString());

            Assert.False(response.IsSuccess);
            Assert.Contains("User not found.", response.ErrorsMessages);
        }

        [Fact]
        public async Task SoftDelete_ShouldReturnError_WhenPasswordIncorrect()
        {
            using var ctx = CreateInMemoryContext();
            var mapper = CreateMapper();
            var hasher = CreatePasswordHasher();
            var service = new OfferServices(ctx, hasher, mapper);

            var user = NewUser();
            user.Password = hasher.HashPassword(user, "CorrectPassword123!");
            ctx.Users.Add(user);
            await ctx.SaveChangesAsync();

            var dto = new SoftDeleteDto
            {
                Id = Guid.NewGuid().ToString(),
                Password = "WrongPassword!"
            };

            ApiResponse response = await service.SoftDelete(dto, user.Id.ToString());

            Assert.False(response.IsSuccess);
            Assert.Contains("Password was incorrect.", response.ErrorsMessages);
        }

        [Fact]
        public async Task SoftDelete_ShouldReturnNotFound_WhenOfferNotFoundForUser()
        {
            using var ctx = CreateInMemoryContext();
            var mapper = CreateMapper();
            var hasher = CreatePasswordHasher();
            var service = new OfferServices(ctx, hasher, mapper);

            var user = NewUser();
            user.Password = hasher.HashPassword(user, "CorrectPassword123!");
            ctx.Users.Add(user);
            await ctx.SaveChangesAsync();

            var dto = new SoftDeleteDto
            {
                Id = Guid.NewGuid().ToString(),
                Password = "CorrectPassword123!"
            };

            ApiResponse response = await service.SoftDelete(dto, user.Id.ToString());

            Assert.False(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.NotFound, response.GetStatusCode());
            Assert.Contains("Offer not found", response.ErrorsMessages);
        }

        #endregion

        #region GetBoughtOffers / GetSoldOffers

        [Fact]
        public async Task GetSoldOffers_ShouldReturnOffersMarkedAsBought_ForSeller()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var seller = NewUser("seller@test.pl");
            var buyer = NewUser("buyer@test.pl");
            var cat = NewCategory();

            ctx.Users.AddRange(seller, buyer);
            ctx.Categories.Add(cat);

            var offer = NewOffer(seller, cat, isBought: true);
            ctx.Offers.Add(offer);

            // Uwaga: Order.ShippingAddress jest [NotNull] - ustawiamy zawsze
            var order = new Order
            {
                Id = Guid.NewGuid(),
                OfferId = offer.Id,
                Offer = offer,
                SellerId = seller.Id,
                Seller = seller,
                BuyerId = buyer.Id,
                Buyer = buyer,
                PaymentMethod = PaymentMethod.Unknown,
                DeliveryMethodIdDeliveryMethod = DeliveryMethod.Unknown,
                MarkAsBought = true,
                ShippingAddress = new ShippingAddressValue(NewAddress(buyer)),
                PurchasedAtUtc = DateTime.UtcNow
            };
            ctx.Orders.Add(order);

            await ctx.SaveChangesAsync();

            ApiResponse response = await service.GetSoldOffers(seller.Id.ToString());

            Assert.True(response.IsSuccess);
            Assert.Equal(200, response.GetStatusCode());

            var list = Assert.IsType<List<GetUserOffers>>(response.Result);
            Assert.Single(list);
            Assert.Equal(offer.Id, list[0].Id);
        }

        [Fact]
        public async Task GetBoughtOffers_ShouldReturnOffersMarkedAsBought_ForBuyer()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var seller = NewUser("seller@test.pl");
            var buyer = NewUser("buyer@test.pl");
            var cat = NewCategory();

            ctx.Users.AddRange(seller, buyer);
            ctx.Categories.Add(cat);

            var offer = NewOffer(seller, cat, isBought: true);
            ctx.Offers.Add(offer);

            var order = new Order
            {
                Id = Guid.NewGuid(),
                OfferId = offer.Id,
                Offer = offer,
                SellerId = seller.Id,
                Seller = seller,
                BuyerId = buyer.Id,
                Buyer = buyer,
                PaymentMethod = PaymentMethod.Unknown,
                DeliveryMethodIdDeliveryMethod = DeliveryMethod.Unknown,
                MarkAsBought = true,
                ShippingAddress = new ShippingAddressValue(NewAddress(buyer)),
                PurchasedAtUtc = DateTime.UtcNow
            };
            ctx.Orders.Add(order);

            await ctx.SaveChangesAsync();

            ApiResponse response = await service.GetBoughtOffers(buyer.Id.ToString());

            Assert.True(response.IsSuccess);
            Assert.Equal(200, response.GetStatusCode());

            var list = Assert.IsType<List<GetUserOffers>>(response.Result);
            Assert.Single(list);
            Assert.Equal(offer.Id, list[0].Id);
        }

        #endregion

        #region MarkAsBought

        [Fact]
        public async Task MarkAsBought_ShouldSetOfferBought_AndCreateOrder_WhenOwnerCalls()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var seller = NewUser("seller@test.pl");
            var cat = NewCategory();

            ctx.Users.Add(seller);
            ctx.Categories.Add(cat);

            var offer = NewOffer(seller, cat, isBought: false);
            ctx.Offers.Add(offer);

            await ctx.SaveChangesAsync();

            var dto = new GetOfferByIdDto { Id = offer.Id.ToString() };

            ApiResponse response = await service.MarkAsBought(dto, seller.Id.ToString());

            Assert.True(response.IsSuccess);
            Assert.Equal(200, response.GetStatusCode());

            var updated = await ctx.Offers.SingleAsync(o => o.Id == offer.Id);
            Assert.True(updated.IsBought);

            var order = await ctx.Orders.SingleAsync(o => o.OfferId == offer.Id);
            Assert.True(order.MarkAsBought);
            Assert.Equal(seller.Id, order.SellerId);
            Assert.Null(order.BuyerId);
        }

        [Fact]
        public async Task MarkAsBought_ShouldReturnNotFound_WhenOfferNotOwned()
        {
            using var ctx = CreateInMemoryContext();
            var service = CreateService(ctx);

            var owner = NewUser("owner@test.pl");
            var other = NewUser("other@test.pl");
            var cat = NewCategory();

            ctx.Users.AddRange(owner, other);
            ctx.Categories.Add(cat);

            var offer = NewOffer(owner, cat, isBought: false);
            ctx.Offers.Add(offer);

            await ctx.SaveChangesAsync();

            var dto = new GetOfferByIdDto { Id = offer.Id.ToString() };

            ApiResponse response = await service.MarkAsBought(dto, other.Id.ToString());

            Assert.False(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.NotFound, response.GetStatusCode());
            Assert.Contains("Offer was not found.", response.ErrorsMessages);
        }

        #endregion
    }
}
