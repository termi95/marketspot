using AutoMapper;
using Marketspot.DataAccess;
using Marketspot.DataAccess.Entities;
using Marketspot.Model;
using Marketspot.Model.Category;
using Marketspot.Model.User;
using Marketspot.Validator;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Backend.Services
{
    public class CategoryServices(UserDbContext context, IMapper mapper)
    {
        private readonly UserDbContext _context = context;
        private readonly IMapper _mapper = mapper;
        public async Task<ApiResponse> AddCategory(AddCategoryDto dto, string userId)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            if (await IsAuthorized(userId, response))
            {
                return response;
            }
            if (string.IsNullOrEmpty(dto.ParentId))
            {
                dto.ParentId = Guid.Empty.ToString();
            }
            Category category = _mapper.Map<Category>(dto);
            await _context.Categories.AddAsync(category);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {

                if (e.InnerException is not null && e.InnerException.Message.Contains("duplicate"))
                {
                    response.ErrorsMessages.Add($"Category or subcategory with name {dto.Name} already exist.");
                }
                else
                {
                    response.ErrorsMessages.Add(e.Message);
                }
                return response;
            }
            response.SetStatusCode(HttpStatusCode.Created);
            response.Result = category;
            return response;
        }

        public async Task<ApiResponse> GetCategoryByParentId(GetCategoryDto dto)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            Guid parentId = string.IsNullOrEmpty(dto.ParentId) ? Guid.Empty : Guid.Parse(dto.ParentId);

            var categories = _context.Categories.Where(x => x.ParentId == parentId).ToList();

            response.SetStatusCode(HttpStatusCode.OK);
            response.Result = categories;
            return response;
        }
        public async Task<ApiResponse> DeleteCategoryById(DeleteCategoryDto dto, string userId)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            if (await IsAuthorized(userId, response))
            {
                return response;
            }

            Guid id = string.IsNullOrEmpty(dto.Id) ? Guid.Empty : Guid.Parse(dto.Id);

            var categories = _context.Categories.FromSqlRaw(RawSqlHelper.GetParentCategoriesWithAllChildrenById(),id).ToArray();
            try
            {
                _context.Categories.RemoveRange(categories);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                if (ex.InnerException is not null)
                {
                    response.ErrorsMessages.Add(ex.InnerException.Message);
                }
                else
                {
                    response.ErrorsMessages.Add(ex.Message);
                }
                return response;
            }
            response.SetStatusCode(HttpStatusCode.OK);
            return response;
        }

        private async Task<User> GetUserById(string userId)
        {
            return await _context.Users.FindAsync(Guid.Parse(userId));
        }

        private async Task<bool> IsAuthorized(string userId, ApiResponse response)
        {
            var user = await GetUserById(userId);
            bool isAuth = user is not null && user.Roles != UserEnum.UserRoles.Admin;
            if (isAuth)
            {
                response.SetStatusCode(HttpStatusCode.Unauthorized);
                response.ErrorsMessages.Add("You are unauthorized to do this action.");
            }
            return isAuth;
        }
    }
}
