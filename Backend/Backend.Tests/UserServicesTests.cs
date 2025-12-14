using AutoMapper;
using backend;
using backend.Model.User;
using backend.Services;
using Marketspot.DataAccess.Entities;
using Marketspot.Model.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Net;

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
            JwtKey = "supersecretkey_supersecretkey_supersecretkeysupersecretkey_supersecretkey_supersecretkey12345678",
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
    [Fact]
    public async Task GetPersonalInfo_ShouldReturnError_WhenUserDoesNotExist()
    {
        using var context = CreateInMemoryContext();
        var passwordHasher = new PasswordHasher<User>();
        var auth = CreateAuthSettings();
        var mapper = CreateMapper();

        var service = new UserServices(context, passwordHasher, auth, mapper);

        // Act
        var response = await service.GetPersonalInfo(Guid.NewGuid().ToString());

        // Assert
        Assert.False(response.IsSuccess);
        Assert.Equal((int)HttpStatusCode.NotFound, response.GetStatusCode());
        Assert.NotEmpty(response.ErrorsMessages);
        Assert.Contains("User was not found.", response.ErrorsMessages);
    }
    [Fact]
    public async Task Login_ShouldReturnError_WhenUserDoesNotExist()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new UserServices(context,new PasswordHasher<User>(),CreateAuthSettings(),CreateMapper());

        var dto = new LoginUserDto
        {
            Email = "xyz@test.pl",
            Password = "CorrectPassword123!"
        };

        // Act
        var response = await service.Login(dto);

        // Assert
        Assert.False(response.IsSuccess);
        Assert.NotEmpty(response.ErrorsMessages);
        Assert.Null(response.Result);
        Assert.Contains("User not found or Password was incorrect.", response.ErrorsMessages);
    }
    [Fact]
    public async Task Login_ShouldReturnValidationError_WhenPasswordIsTooShort()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new UserServices(context, new PasswordHasher<User>(), CreateAuthSettings(), CreateMapper());

        var dto = new LoginUserDto
        {
            Email = "xyz@test.pl",
            Password = "xyz"
        };

        // Act
        var response = await service.Login(dto);

        // Assert
        Assert.False(response.IsSuccess);
        Assert.NotEmpty(response.ErrorsMessages);
        Assert.Null(response.Result);
        Assert.True(response.IsValidationError);
    }
    [Fact]
    public async Task Login_ShouldReturnValidationError_WhenEmailIsTooLong()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new UserServices(context, new PasswordHasher<User>(), CreateAuthSettings(), CreateMapper());

        var dto = new LoginUserDto
        {
            Email = "xyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyz@test.pl",
            Password = "CorrectPassword123!"
        };

        // Act
        var response = await service.Login(dto);

        // Assert
        Assert.False(response.IsSuccess);
        Assert.NotEmpty(response.ErrorsMessages);
        Assert.Null(response.Result);
        Assert.True(response.IsValidationError);
    }
    [Fact]
    public async Task Login_ShouldReturnError_WhenPasswordIsIncorect()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var passwordHasher = new PasswordHasher<User>();
        var auth = CreateAuthSettings();
        var mapper = CreateMapper();

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = "Jan",
            Surname = "Kowalski",
            Email = "jan@example.com",
        };

        user.Password = passwordHasher.HashPassword(user, "CorrectPassword123!");

        context.Users.Add(user);
        await context.SaveChangesAsync();

        var service = new UserServices(context, passwordHasher, auth, mapper);
        var dto = new LoginUserDto
        {
            Email = "jan@example.com",
            Password = "WrongPassword123!"
        };
        // Act
        var response = await service.Login(dto);

        // Assert
        Assert.False(response.IsSuccess);
        Assert.NotEmpty(response.ErrorsMessages);
        Assert.Null(response.Result);
        Assert.False(response.IsValidationError);
    }

    [Fact]
    public async Task Login_ShouldReturnToken_WhenLogin()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var passwordHasher = new PasswordHasher<User>();
        var auth = CreateAuthSettings();
        var mapper = CreateMapper();

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = "Jan",
            Surname = "Kowalski",
            Email = "jan@example.com",
        };

        user.Password = passwordHasher.HashPassword(user, "CorrectPassword123!");

        context.Users.Add(user);
        await context.SaveChangesAsync();

        var service = new UserServices(context, passwordHasher, auth, mapper);
        var dto = new LoginUserDto
        {
            Email = "jan@example.com",
            Password = "CorrectPassword123!"
        };
        // Act
        var response = await service.Login(dto);

        // Assert
        Assert.True(response.IsSuccess);
        Assert.Empty(response.ErrorsMessages);
        Assert.NotNull(response.Result);
        Assert.False(response.IsValidationError);
        Assert.IsType<string>(response.Result);
    }
    [Fact]
    public async Task Register_ShouldReturnValidationError_WhenDtoIsInvalid()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new UserServices(context, new PasswordHasher<User>(), CreateAuthSettings(), CreateMapper());

        var dto = new RegisterUserDto
        {
            Email = "jan@example.com",
            Password = "xyz",
            Name = "Test",
            Surname = "Test"
        };

        // Act
        var response = await service.Register(dto);

        // Assert
        Assert.False(response.IsSuccess);
        Assert.True(response.IsValidationError);
        Assert.NotEmpty(response.ErrorsMessages);
        Assert.Null(response.Result);

        Assert.Equal(0, await context.Users.CountAsync());
    }

    [Fact]
    public async Task Register_ShouldReturnError_WhenEmailIsTaken()
    {
        // Arrange
        using var context = CreateInMemoryContext();

        context.Users.Add(new User
        {
            Id = Guid.NewGuid(),
            Email = "jan@example.com",
            Name = "Existing",
            Surname = "User",
            Password = "hash"
        });
        await context.SaveChangesAsync();

        var service = new UserServices(context, new PasswordHasher<User>(), CreateAuthSettings(), CreateMapper());

        var dto = new RegisterUserDto
        {
            Email = "jan@example.com",
            Password = "CorrectPassword123!",
            Name = "Test",
            Surname = "Test"
        };

        // Act
        var response = await service.Register(dto);

        // Assert
        Assert.False(response.IsSuccess);
        Assert.False(response.IsValidationError);
        Assert.NotEmpty(response.ErrorsMessages);
        Assert.Contains("Email \"jan@example.com\" is taken.", response.ErrorsMessages);

        Assert.Equal(1, await context.Users.CountAsync());
    }

    [Fact]
    public async Task Register_ShouldCreateUser_WhenDataIsValid()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var passwordHasher = new PasswordHasher<User>();
        var service = new UserServices(context, passwordHasher, CreateAuthSettings(), CreateMapper());

        var dto = new RegisterUserDto
        {
            Email = "jan@example.com",
            Password = "CorrectPassword123!",
            Name = "Test",
            Surname = "Test"
        };

        // Act
        var response = await service.Register(dto);

        // Assert
        Assert.True(response.IsSuccess);
        Assert.Equal((int)HttpStatusCode.Created, response.GetStatusCode());
        Assert.Empty(response.ErrorsMessages);

        var user = await context.Users.SingleAsync();
        Assert.Equal("jan@example.com", user.Email);
        Assert.NotEqual("CorrectPassword123!", user.Password);

        var verification = passwordHasher.VerifyHashedPassword(user, user.Password, "CorrectPassword123!");
        Assert.Equal(PasswordVerificationResult.Success, verification);
    }
    [Fact]
    public async Task ChangePassword_ShouldReturnValidationError_WhenDtoIsInvalid()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new UserServices(context, new PasswordHasher<User>(), CreateAuthSettings(), CreateMapper());

        var dto = new ChangePasswordDto
        {
            PasswordChangeToken = "",
            Password = "xyz"
        };

        // Act
        var response = await service.ChangePassword(dto);

        // Assert
        Assert.False(response.IsSuccess);
        Assert.True(response.IsValidationError);
        Assert.NotEmpty(response.ErrorsMessages);
        Assert.Null(response.Result);
    }

    [Fact]
    public async Task ChangePassword_ShouldReturnError_WhenTokenIsInvalidGuid()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new UserServices(context, new PasswordHasher<User>(), CreateAuthSettings(), CreateMapper());

        var dto = new ChangePasswordDto
        {
            PasswordChangeToken = "not-a-guid",
            Password = "CorrectPassword123!"
        };

        // Act
        var response = await service.ChangePassword(dto);

        // Assert
        Assert.False(response.IsSuccess);
        Assert.False(response.IsValidationError);
        Assert.NotEmpty(response.ErrorsMessages);
        Assert.Contains("Invalid password change token.", response.ErrorsMessages);
        Assert.Null(response.Result);
    }

    [Fact]
    public async Task ChangePassword_ShouldReturnError_WhenUserNotFoundByToken()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new UserServices(context, new PasswordHasher<User>(), CreateAuthSettings(), CreateMapper());

        var dto = new ChangePasswordDto
        {
            PasswordChangeToken = Guid.NewGuid().ToString(),
            Password = "CorrectPassword123!"
        };

        // Act
        var response = await service.ChangePassword(dto);

        // Assert
        Assert.False(response.IsSuccess);
        Assert.False(response.IsValidationError);
        Assert.NotEmpty(response.ErrorsMessages);
        Assert.Contains("User not found or password change token expired.", response.ErrorsMessages);
        Assert.Null(response.Result);
    }

    [Fact]
    public async Task ChangePassword_ShouldReturnError_WhenTokenIsExpired()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var passwordHasher = new PasswordHasher<User>();

        var token = Guid.NewGuid();
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "jan@example.com",
            Name = "Jan",
            Surname = "Kowalski",
            Password = passwordHasher.HashPassword(new User(), "OldPassword123!"),
            PasswordChangeToken = token,
            PasswordAllowTimeToChange = DateTime.Now.AddMinutes(-5) // wygasł
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        var service = new UserServices(context, passwordHasher, CreateAuthSettings(), CreateMapper());

        var dto = new ChangePasswordDto
        {
            PasswordChangeToken = token.ToString(),
            Password = "CorrectPassword123!"
        };

        // Act
        var response = await service.ChangePassword(dto);

        // Assert
        Assert.False(response.IsSuccess);
        Assert.False(response.IsValidationError);
        Assert.NotEmpty(response.ErrorsMessages);
        Assert.Contains("User not found or password change token expired.", response.ErrorsMessages);

        // upewnij się, że hasło się nie zmieniło
        var dbUser = await context.Users.AsNoTracking().SingleAsync(u => u.Id == user.Id);
        Assert.Equal(user.Password, dbUser.Password);
    }

    [Fact]
    public async Task ChangePassword_ShouldChangePasswordAndInvalidateToken_WhenTokenIsValid()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var passwordHasher = new PasswordHasher<User>();

        var token = Guid.NewGuid();
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "jan@example.com",
            Name = "Jan",
            Surname = "Kowalski",
            PasswordChangeToken = token,
            PasswordAllowTimeToChange = DateTime.Now.AddHours(1)
        };

        user.Password = passwordHasher.HashPassword(user, "OldPassword123!");

        context.Users.Add(user);
        await context.SaveChangesAsync();
        var oldHash = user.Password;

        var service = new UserServices(context, passwordHasher, CreateAuthSettings(), CreateMapper());

        var dto = new ChangePasswordDto
        {
            PasswordChangeToken = token.ToString(),
            Password = "CorrectPassword123!"
        };

        // Act
        var response = await service.ChangePassword(dto);

        // Assert
        Assert.True(response.IsSuccess);
        Assert.Equal((int)HttpStatusCode.OK, response.GetStatusCode());
        Assert.Empty(response.ErrorsMessages);
        Assert.False(response.IsValidationError);

        var updated = await context.Users.AsNoTracking().SingleAsync(u => u.Id == user.Id);

        Assert.NotEqual(oldHash, updated.Password);
        var verification = passwordHasher.VerifyHashedPassword(updated, updated.Password, "CorrectPassword123!");
        Assert.Equal(PasswordVerificationResult.Success, verification);

        Assert.Equal(DateTime.MinValue, updated.PasswordAllowTimeToChange);
    }
    [Fact]
    public async Task UpdateSettingsPersonalInformation_ShouldReturnValidationError_WhenDtoIsInvalid()
    {
        using var context = CreateInMemoryContext();
        var service = new UserServices(context, new PasswordHasher<User>(), CreateAuthSettings(), CreateMapper());

        var dto = new SettingsPersonalInformationDto
        {
            Email = "",
            Name = "",
            Surname = "Ok",
            Password = ""
        };

        var response = await service.UpdateSettingsPersonalInformation(Guid.NewGuid().ToString(), dto);

        Assert.False(response.IsSuccess);
        Assert.True(response.IsValidationError);
        Assert.NotEmpty(response.ErrorsMessages);
        Assert.Null(response.Result);
    }

    [Fact]
    public async Task UpdateSettingsPersonalInformation_ShouldReturnError_WhenUserDoesNotExist()
    {
        using var context = CreateInMemoryContext();
        var service = new UserServices(context, new PasswordHasher<User>(), CreateAuthSettings(), CreateMapper());

        var dto = new SettingsPersonalInformationDto
        {
            Email = "jan.updated@example.com",
            Name = "JanUpdated",
            Surname = "KowalskiUpdated",
            Password = "CorrectPassword123!"
        };

        var response = await service.UpdateSettingsPersonalInformation(Guid.NewGuid().ToString(), dto);

        Assert.False(response.IsSuccess);
        Assert.False(response.IsValidationError);
        Assert.NotEmpty(response.ErrorsMessages);
        Assert.Contains("User not found or Password was incorrect.", response.ErrorsMessages);
        Assert.Null(response.Result);
    }

    [Fact]
    public async Task UpdateSettingsPersonalInformation_ShouldReturnError_WhenPasswordIsIncorrect()
    {
        using var context = CreateInMemoryContext();
        var passwordHasher = new PasswordHasher<User>();

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "jan@example.com",
            Name = "Jan",
            Surname = "Kowalski"
        };
        user.Password = passwordHasher.HashPassword(user, "CorrectPassword123!");

        context.Users.Add(user);
        await context.SaveChangesAsync();

        var service = new UserServices(context, passwordHasher, CreateAuthSettings(), CreateMapper());

        var dto = new SettingsPersonalInformationDto
        {
            Email = "jan.updated@example.com",
            Name = "JanUpdated",
            Surname = "KowalskiUpdated",
            Password = "WrongPassword123!"
        };

        var response = await service.UpdateSettingsPersonalInformation(user.Id.ToString(), dto);

        Assert.False(response.IsSuccess);
        Assert.False(response.IsValidationError);
        Assert.NotEmpty(response.ErrorsMessages);
        Assert.Contains("User not found or Password was incorrect.", response.ErrorsMessages);
        Assert.Null(response.Result);

        var dbUser = await context.Users.AsNoTracking().SingleAsync(u => u.Id == user.Id);
        Assert.Equal("jan@example.com", dbUser.Email);
        Assert.Equal("Jan", dbUser.Name);
        Assert.Equal("Kowalski", dbUser.Surname);
    }

    [Fact]
    public async Task UpdateSettingsPersonalInformation_ShouldUpdateFields_WhenPasswordIsCorrect()
    {
        using var context = CreateInMemoryContext();
        var passwordHasher = new PasswordHasher<User>();

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "jan@example.com",
            Name = "Jan",
            Surname = "Kowalski"
        };
        user.Password = passwordHasher.HashPassword(user, "CorrectPassword123!");
        var oldPasswordHash = user.Password;

        context.Users.Add(user);
        await context.SaveChangesAsync();

        var service = new UserServices(context, passwordHasher, CreateAuthSettings(), CreateMapper());

        var dto = new SettingsPersonalInformationDto
        {
            Email = "new@email.com",
            Name = "NewName",
            Surname = "NewSurname",
            Password = "CorrectPassword123!"
        };

        var response = await service.UpdateSettingsPersonalInformation(user.Id.ToString(), dto);

        Assert.True(response.IsSuccess);
        Assert.Equal((int)HttpStatusCode.OK, response.GetStatusCode());
        Assert.Empty(response.ErrorsMessages);
        Assert.False(response.IsValidationError);

        var updated = await context.Users.AsNoTracking().SingleAsync(u => u.Id == user.Id);
        Assert.Equal("new@email.com", updated.Email);
        Assert.Equal("NewName", updated.Name);
        Assert.Equal("NewSurname", updated.Surname);
        Assert.Equal(oldPasswordHash, updated.Password);
    }

    [Fact]
    public async Task UpdateSettingsPersonalInformation_ShouldReturnError_WhenUserIdIsInvalid()
    {
        using var context = CreateInMemoryContext();
        var service = new UserServices(context, new PasswordHasher<User>(), CreateAuthSettings(), CreateMapper());

        var dto = new SettingsPersonalInformationDto
        {
            Email = "jan.updated@example.com",
            Name = "JanUpdated",
            Surname = "KowalskiUpdated",
            Password = "CorrectPassword123!"
        };

        var response = await service.UpdateSettingsPersonalInformation("not-a-guid", dto);

        Assert.False(response.IsSuccess);
        Assert.NotEmpty(response.ErrorsMessages);
        Assert.Contains("Invalid user id.", response.ErrorsMessages);
    }

    [Fact]
    public async Task UpdateSettingsPersonalInformation_ShouldAllowSurnameNull_IfValidatorAllowsIt()
    {
        using var context = CreateInMemoryContext();
        var passwordHasher = new PasswordHasher<User>();

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "jan@example.com",
            Name = "Jan",
            Surname = "Kowalski"
        };
        user.Password = passwordHasher.HashPassword(user, "CorrectPassword123!");

        context.Users.Add(user);
        await context.SaveChangesAsync();

        var service = new UserServices(context, passwordHasher, CreateAuthSettings(), CreateMapper());

        var dto = new SettingsPersonalInformationDto
        {
            Email = "jan.updated@example.com",
            Name = "JanUpdated",
            Surname = null,
            Password = "CorrectPassword123!"
        };

        var response = await service.UpdateSettingsPersonalInformation(user.Id.ToString(), dto);

        if (response.IsValidationError)
            return;

        Assert.True(response.IsSuccess);

        var updated = await context.Users.AsNoTracking().SingleAsync(u => u.Id == user.Id);
        Assert.Null(updated.Surname);
    }

}
