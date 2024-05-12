using AutoMapper;
using backend.Entities;
using backend.Model.User;
using Marketspot.Model.Category;

namespace Backend
{
    public class MappingConfig : Profile
    {
        public MappingConfig()
        {
            CreateMap<RegisterUserDto, User>();
            CreateMap<AddCategoryDto, Category>();
        }
    }
}
