using AutoMapper;
using backend;
using backend.Services;
using Marketspot.DataAccess.Entities;
using Marketspot.Model.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Backend.Tests;

public class UserServicesTests
{
    private UserDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<UserDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // nowa baza dla każdego testu
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

    private AuthenticationSettings CreateAuthSettings()
    {
        return new AuthenticationSettings
        {
            JwtKey = "supersecretkey_supersecretkey_supersecretkey", // min. 32+ znaków
            JwtExpireDays = 7,
            JwtIssuer = "test-issuer"
        };
    }

    [Fact]
    public async Task GetPersonalInfo_ShouldReturnBasicUser_WhenUserExists()
    {
        using var context = CreateInMemoryContext();

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = "Jan",
            Surname = "Kowalski",
            Email = "jan@example.com",
            Password = "hash"
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        var passwordHasher = new PasswordHasher<User>();
        var auth = CreateAuthSettings();
        var mapper = CreateMapper();

        var service = new UserServices(context, passwordHasher, auth, mapper);

        // Act
        var response = await service.GetPersonalInfo(user.Id.ToString());

        // Assert
        Assert.True(response.IsSuccess);
        Assert.Equal(200, response.GetStatusCode());
        Assert.Empty(response.ErrorsMessages);

        var result = Assert.IsType<BasicUser>(response.Result);
        Assert.Equal(user.Id, result.Id);
        Assert.Equal(user.Email, result.Email);
        Assert.Equal(user.Name, result.Name);
        Assert.Equal(user.Surname, result.Surname);
    }

}
