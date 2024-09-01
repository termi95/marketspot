using AutoMapper;
using backend.Model.User;
using Marketspot.DataAccess.Entities;
using Marketspot.Model.Category;
using Marketspot.Model.Offer;
using Marketspot.Model.User;

namespace Backend
{
    public class MappingConfig : Profile
    {
        public MappingConfig()
        {
            CreateMap<RegisterUserDto, User>();
            CreateMap<AddCategoryDto, Category>();
            CreateMap<AddOfferDto, Offer>();
            CreateMap<Offer, GetOfferByIdResult>();
            CreateMap<User, BasicUser>();
            CreateMap<Category, BasicCategory>();
        }
    }
}
