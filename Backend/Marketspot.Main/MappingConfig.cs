using AutoMapper;
using backend.Entities;
using backend.Model.User;
using Marketspot.DataAccess.Entities;
using Marketspot.Model.Category;
using Marketspot.Validator.Validator.Offer;

namespace Backend
{
    public class MappingConfig : Profile
    {
        public MappingConfig()
        {
            CreateMap<RegisterUserDto, User>();
            CreateMap<AddCategoryDto, Category>();
            CreateMap<AddOfferDto, Offer>();
        }
    }
}
