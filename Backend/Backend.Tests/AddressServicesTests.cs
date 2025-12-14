using AutoMapper;
using Backend.Services;
using Marketspot.DataAccess.Entities;
using Marketspot.Model.Address;
using Marketspot.Model.Category;
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
    public class AddressServicesTests
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
        public async Task Upsert_ShouldReturnValidationError_WhenDtoIsInvalid()
        {
            using var context = CreateInMemoryContext();
            var service = new AddressServices(context);

            var dto = new UpsertAddressDto
            {
                Id = "",
                Name = "",
                City = "",
                Country = "",
                Phone = "",
                Street = ""
            };

            var response = await service.Upsert(dto, Guid.NewGuid().ToString());

            Assert.False(response.IsSuccess);
            Assert.True(response.IsValidationError);
            Assert.NotEmpty(response.ErrorsMessages);
            Assert.Null(response.Result);

            Assert.Equal(0, await context.Addresses.CountAsync());
        }

        [Fact]
        public async Task Upsert_ShouldCreateAddress_WhenIdIsEmpty()
        {
            using var context = CreateInMemoryContext();
            var service = new AddressServices(context);

            var userId = Guid.NewGuid();

            var dto = new UpsertAddressDto
            {
                Id = "",
                Name = "Home",
                City = "Warsaw",
                Country = "PL",
                Phone = "123456789",
                Street = "Street 1"
            };

            var response = await service.Upsert(dto, userId.ToString());

            Assert.True(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.Created, response.GetStatusCode());
            Assert.Empty(response.ErrorsMessages);
            Assert.NotNull(response.Result);

            var created = await context.Addresses.SingleAsync();
            Assert.Equal(userId, created.UserId);
            Assert.Equal("Home", created.Name);
            Assert.Equal("Warsaw", created.City);
            Assert.Equal("PL", created.Country);
            Assert.Equal("123456789", created.Phone);
            Assert.Equal("Street 1", created.Street);
        }

        [Fact]
        public async Task Upsert_ShouldUpdateAddress_WhenIdExistsForUser()
        {
            using var context = CreateInMemoryContext();
            var service = new AddressServices(context);

            var userId = Guid.NewGuid();

            var existing = new Address
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Old",
                City = "OldCity",
                Country = "PL",
                Phone = "000",
                Street = "OldStreet"
            };
            context.Addresses.Add(existing);
            await context.SaveChangesAsync();

            var dto = new UpsertAddressDto
            {
                Id = existing.Id.ToString(),
                Name = "NewName",
                City = "NewCity",
                Country = "DE",
                Phone = "999",
                Street = "NewStreet"
            };

            var response = await service.Upsert(dto, userId.ToString());

            Assert.True(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.OK, response.GetStatusCode());
            Assert.Empty(response.ErrorsMessages);
            Assert.NotNull(response.Result);

            var updated = await context.Addresses.AsNoTracking().SingleAsync(a => a.Id == existing.Id);
            Assert.Equal("NewName", updated.Name);
            Assert.Equal("NewCity", updated.City);
            Assert.Equal("DE", updated.Country);
            Assert.Equal("999", updated.Phone);
            Assert.Equal("NewStreet", updated.Street);
        }

        [Fact]
        public async Task Upsert_ShouldReturnError_WhenUpdatingAddressNotOwnedByUser()
        {
            using var context = CreateInMemoryContext();
            var service = new AddressServices(context);

            var ownerId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            var existing = new Address
            {
                Id = Guid.NewGuid(),
                UserId = ownerId,
                Name = "Owner",
                City = "City",
                Country = "PL",
                Phone = "111",
                Street = "Street"
            };
            context.Addresses.Add(existing);
            await context.SaveChangesAsync();

            var dto = new UpsertAddressDto
            {
                Id = existing.Id.ToString(),
                Name = "Hack",
                City = "HackCity",
                Country = "DE",
                Phone = "999",
                Street = "HackStreet"
            };

            var response = await service.Upsert(dto, otherUserId.ToString());

            Assert.False(response.IsSuccess);
            Assert.False(response.IsValidationError);
            Assert.NotEmpty(response.ErrorsMessages);
            Assert.Contains("Address not found.", response.ErrorsMessages);

            var unchanged = await context.Addresses.AsNoTracking().SingleAsync(a => a.Id == existing.Id);
            Assert.Equal("Owner", unchanged.Name);
            Assert.Equal("City", unchanged.City);
            Assert.Equal("PL", unchanged.Country);
            Assert.Equal("111", unchanged.Phone);
            Assert.Equal("Street", unchanged.Street);
        }

        [Fact]
        public async Task Upsert_ShouldReturnError_WhenIdIsInvalidGuid()
        {
            using var context = CreateInMemoryContext();
            var service = new AddressServices(context);

            var userId = Guid.NewGuid();

            var dto = new UpsertAddressDto
            {
                Id = "not-a-guid",
                Name = "Name",
                City = "City",
                Country = "PL",
                Phone = "123",
                Street = "Street"
            };

            var response = await service.Upsert(dto, userId.ToString());

            Assert.False(response.IsSuccess);
            Assert.False(response.IsValidationError);
            Assert.NotEmpty(response.ErrorsMessages);
            Assert.Contains("Address not found.", response.ErrorsMessages);

            Assert.Equal(0, await context.Addresses.CountAsync());
        }

        [Fact]
        public async Task GetAddress_ShouldReturnOnlyUserAddresses()
        {
            using var context = CreateInMemoryContext();
            var service = new AddressServices(context);

            var userId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            context.Addresses.AddRange(
                new Address
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Name = "A1",
                    City = "C1",
                    Country = "PL",
                    Phone = "1",
                    Street = "S1"
                },
                new Address
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Name = "A2",
                    City = "C2",
                    Country = "PL",
                    Phone = "2",
                    Street = "S2"
                },
                new Address
                {
                    Id = Guid.NewGuid(),
                    UserId = otherUserId,
                    Name = "B1",
                    City = "C3",
                    Country = "DE",
                    Phone = "3",
                    Street = "S3"
                }
            );
            await context.SaveChangesAsync();

            var response = await service.GetAddress(userId.ToString());

            Assert.True(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.OK, response.GetStatusCode());
            Assert.Empty(response.ErrorsMessages);

            var list = Assert.IsType<List<Address>>(response.Result);
            Assert.Equal(2, list.Count);
            Assert.All(list, a => Assert.Equal(userId, a.UserId));
        }

        [Fact]
        public async Task DeleteAddress_ShouldReturnValidationError_WhenDtoIsInvalid()
        {
            using var context = CreateInMemoryContext();
            var service = new AddressServices(context);

            var dto = new DeleteAddressDto { Id = "" };

            var response = await service.DeleteAddress(dto, Guid.NewGuid().ToString());

            Assert.False(response.IsSuccess);
            Assert.True(response.IsValidationError);
            Assert.NotEmpty(response.ErrorsMessages);
        }

        [Fact]
        public async Task DeleteAddress_ShouldReturnNotFound_WhenAddressDoesNotExist()
        {
            using var context = CreateInMemoryContext();
            var service = new AddressServices(context);

            var dto = new DeleteAddressDto { Id = Guid.NewGuid().ToString() };

            var response = await service.DeleteAddress(dto, Guid.NewGuid().ToString());

            Assert.False(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.NotFound, response.GetStatusCode());
            Assert.NotEmpty(response.ErrorsMessages);
            Assert.Contains("Address was not found.", response.ErrorsMessages);
        }

        [Fact]
        public async Task DeleteAddress_ShouldDeleteAddress_WhenExistsForUser()
        {
            using var context = CreateInMemoryContext();
            var service = new AddressServices(context);

            var userId = Guid.NewGuid();
            var address = new Address
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = "Home",
                City = "Warsaw",
                Country = "PL",
                Phone = "123",
                Street = "Street 1"
            };
            context.Addresses.Add(address);
            await context.SaveChangesAsync();

            var dto = new DeleteAddressDto { Id = address.Id.ToString() };

            var response = await service.DeleteAddress(dto, userId.ToString());

            Assert.True(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.OK, response.GetStatusCode());
            Assert.Empty(response.ErrorsMessages);

            Assert.Equal(0, await context.Addresses.CountAsync());
        }

        [Fact]
        public async Task DeleteAddress_ShouldReturnNotFound_WhenAddressExistsButBelongsToOtherUser()
        {
            using var context = CreateInMemoryContext();
            var service = new AddressServices(context);

            var ownerId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();

            var address = new Address
            {
                Id = Guid.NewGuid(),
                UserId = ownerId,
                Name = "Owner",
                City = "City",
                Country = "PL",
                Phone = "111",
                Street = "Street"
            };
            context.Addresses.Add(address);
            await context.SaveChangesAsync();

            var dto = new DeleteAddressDto { Id = address.Id.ToString() };

            var response = await service.DeleteAddress(dto, otherUserId.ToString());

            Assert.False(response.IsSuccess);
            Assert.Equal((int)HttpStatusCode.NotFound, response.GetStatusCode());
            Assert.NotEmpty(response.ErrorsMessages);
            Assert.Contains("Address was not found.", response.ErrorsMessages);

            Assert.Equal(1, await context.Addresses.CountAsync());
        }

    }
}
