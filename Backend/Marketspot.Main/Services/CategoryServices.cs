using AutoMapper;
using backend.Entities;
using Marketspot.Model;
using Marketspot.Model.Category;
using Marketspot.Validator;

namespace Backend.Services
{
    public class CategoryService(UserDbContext context, IMapper mapper)
    {
        private readonly UserDbContext _context = context;
        private readonly IMapper _mapper = mapper;
        public async Task<ApiResponse> AddCategory(AddCategoryDto dto)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }
            var category = new Category() { Name = dto.Name, ParentId = dto.ParentId };
            _context.Categories.Add(category);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                response.ErrorsMessages.Add(e.Message);
            }
            response.SetStatusCode(System.Net.HttpStatusCode.Created);
            response.Result = category;
            return response;
        }

        public ApiResponse GetCategoryByParentId()
        {
            var response = new ApiResponse();
            return response;
        }
    }
}
