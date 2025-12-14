using AutoMapper;
using Backend.Services;
using Marketspot.DataAccess.Entities;
using Marketspot.Model.Category;
using Marketspot.Model.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Net;

namespace Backend.Tests;

public class CategoryServicesTests
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
    public async Task AddCategory_ShouldReturnValidationError_WhenDtoIsInvalid()
    {
        using var context = CreateInMemoryContext();
        var service = new CategoryServices(context, CreateMapper());

        var dto = new AddCategoryDto
        {
            Name = "",
            ParentId = ""
        };

        var response = await service.AddCategory(dto, Guid.NewGuid().ToString());

        Assert.False(response.IsSuccess);
        Assert.True(response.IsValidationError);
        Assert.NotEmpty(response.ErrorsMessages);

        Assert.Equal(0, await context.Categories.CountAsync());
    }

    [Fact]
    public async Task AddCategory_ShouldReturnUnauthorized_WhenUserIsNotAdmin()
    {
        using var context = CreateInMemoryContext();

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "user@test.pl",
            Name = "User",
            Surname = "User",
            Roles = UserEnum.UserRoles.User,
            Password = "password"            
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var service = new CategoryServices(context, CreateMapper());

        var dto = new AddCategoryDto
        {
            Name = "Category",
            ParentId = ""
        };

        var response = await service.AddCategory(dto, user.Id.ToString());

        Assert.False(response.IsSuccess);
        Assert.Equal((int)HttpStatusCode.Unauthorized, response.GetStatusCode());
        Assert.Contains("You are unauthorized to do this action.", response.ErrorsMessages);

        Assert.Equal(0, await context.Categories.CountAsync());
    }

    [Fact]
    public async Task AddCategory_ShouldCreateCategory_WhenUserIsAdmin_AndParentIdEmpty()
    {
        using var context = CreateInMemoryContext();

        var admin = new User
        {
            Id = Guid.NewGuid(),
            Email = "admin@test.pl",
            Name = "Admin",
            Surname = "Admin",
            Roles = UserEnum.UserRoles.Admin,
            Password = "password"
        };
        context.Users.Add(admin);
        await context.SaveChangesAsync();

        var service = new CategoryServices(context, CreateMapper());

        var dto = new AddCategoryDto
        {
            Name = "Category",
            ParentId = ""
        };

        var response = await service.AddCategory(dto, admin.Id.ToString());

        Assert.True(response.IsSuccess);
        Assert.Equal((int)HttpStatusCode.Created, response.GetStatusCode());
        Assert.Empty(response.ErrorsMessages);
        Assert.NotNull(response.Result);

        var created = await context.Categories.SingleAsync();
        Assert.Equal("Category", created.Name);
        Assert.Equal(Guid.Empty, created.ParentId);
    }

    [Fact]
    public async Task AddCategory_ShouldReturnUnauthorized_WhenUserDoesNotExist()
    {
        using var context = CreateInMemoryContext();
        var service = new CategoryServices(context, CreateMapper());

        var dto = new AddCategoryDto
        {
            Name = "Category",
            ParentId = ""
        };

        var response = await service.AddCategory(dto, Guid.NewGuid().ToString());

        Assert.False(response.IsSuccess);
        Assert.Equal((int)HttpStatusCode.Unauthorized, response.GetStatusCode());
        Assert.Contains("You are unauthorized to do this action.", response.ErrorsMessages);

        Assert.Equal(0, await context.Categories.CountAsync());
    }

    [Fact]
    public async Task GetCategoryByParentId_ShouldReturnValidationError_WhenDtoIsInvalid()
    {
        using var context = CreateInMemoryContext();
        var service = new CategoryServices(context, CreateMapper());

        var dto = new GetCategoryDto
        {
            ParentId = "not-a-guid"
        };

        var response = await service.GetCategoryByParentId(dto);

        Assert.False(response.IsSuccess);
        Assert.True(response.IsValidationError);
        Assert.NotEmpty(response.ErrorsMessages);
    }

    [Fact]
    public async Task GetCategoryByParentId_ShouldReturnCategories_ForGivenParent()
    {
        using var context = CreateInMemoryContext();

        var parentId = Guid.NewGuid();
        context.Categories.AddRange(
            new Category { Id = Guid.NewGuid(), Name = "A", ParentId = parentId },
            new Category { Id = Guid.NewGuid(), Name = "B", ParentId = parentId },
            new Category { Id = Guid.NewGuid(), Name = "Other", ParentId = Guid.Empty }
        );
        await context.SaveChangesAsync();

        var service = new CategoryServices(context, CreateMapper());

        var dto = new GetCategoryDto { ParentId = parentId.ToString() };

        var response = await service.GetCategoryByParentId(dto);

        Assert.True(response.IsSuccess);
        Assert.Equal((int)HttpStatusCode.OK, response.GetStatusCode());
        Assert.Empty(response.ErrorsMessages);

        var result = Assert.IsType<List<Category>>(response.Result);
        Assert.Equal(2, result.Count);
        Assert.All(result, c => Assert.Equal(parentId, c.ParentId));
    }

    [Fact]
    public async Task GetCategoryByParentId_ShouldUseGuidEmpty_WhenParentIdIsEmpty()
    {
        using var context = CreateInMemoryContext();

        context.Categories.AddRange(
            new Category { Id = Guid.NewGuid(), Name = "Root1", ParentId = Guid.Empty },
            new Category { Id = Guid.NewGuid(), Name = "Root2", ParentId = Guid.Empty },
            new Category { Id = Guid.NewGuid(), Name = "Child", ParentId = Guid.NewGuid() }
        );
        await context.SaveChangesAsync();

        var service = new CategoryServices(context, CreateMapper());

        var dto = new GetCategoryDto { ParentId = "" };

        var response = await service.GetCategoryByParentId(dto);

        Assert.True(response.IsSuccess);
        Assert.Equal((int)HttpStatusCode.OK, response.GetStatusCode());

        var result = Assert.IsType<List<Category>>(response.Result);
        Assert.Equal(2, result.Count);
        Assert.All(result, c => Assert.Equal(Guid.Empty, c.ParentId));
    }

    [Fact]
    public async Task DeleteCategoryById_ShouldReturnValidationError_WhenDtoIsInvalid()
    {
        using var context = CreateInMemoryContext();
        var service = new CategoryServices(context, CreateMapper());

        var dto = new DeleteCategoryDto { Id = "" };

        var response = await service.DeleteCategoryById(dto, Guid.NewGuid().ToString());

        Assert.False(response.IsSuccess);
        Assert.True(response.IsValidationError);
        Assert.NotEmpty(response.ErrorsMessages);
    }

    [Fact]
    public async Task DeleteCategoryById_ShouldReturnUnauthorized_WhenUserIsNotAdmin()
    {
        using var context = CreateInMemoryContext();

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "user@test.pl",
            Name = "User",
            Surname = "User",
            Roles = UserEnum.UserRoles.User,
            Password = "password",
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var service = new CategoryServices(context, CreateMapper());

        var dto = new DeleteCategoryDto { Id = Guid.NewGuid().ToString() };

        var response = await service.DeleteCategoryById(dto, user.Id.ToString());

        Assert.False(response.IsSuccess);
        Assert.Equal((int)HttpStatusCode.Unauthorized, response.GetStatusCode());
        Assert.Contains("You are unauthorized to do this action.", response.ErrorsMessages);
    }
}
