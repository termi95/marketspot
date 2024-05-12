using AutoMapper;
using backend.Entities;
using Marketspot.Model;
using Marketspot.Model.Category;
using Marketspot.Model.User;
using Marketspot.Validator;
using System.Net;

namespace Backend.Services
{
    public class CategoryService(UserDbContext context, IMapper mapper)
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

            if (await IsAuthorized(userId,response))
            {
                return response;
            }

            Category category = _mapper.Map<Category>(dto);
            _context.Categories.Add(category);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                response.ErrorsMessages.Add(e.Message);
            }
            response.SetStatusCode(HttpStatusCode.Created);
            response.Result = category;
            return response;
        }

        public ApiResponse GetCategoryByParentId()
        {
            var response = new ApiResponse();
            return response;
        }

        private async Task<User> GetUserById(string userId)
        {
            return await _context.Users.FindAsync(Guid.Parse(userId));
        }

        private async Task<bool> IsAuthorized(string userId, ApiResponse response)
        {
            var user = await GetUserById(userId);
            bool isAuth = user is not null && user.Roles == UserEnum.UserRoles.Admin;
            if (isAuth)
            {
                response.SetStatusCode(HttpStatusCode.Unauthorized);
                response.ErrorsMessages.Add("You are unauthorized to do this action.");
            }
            return isAuth;
        }
    }
}
