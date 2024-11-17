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
            CreateMap<Offer, GetOfferByIdResult>()
                .ForMember(dest => dest.CreationDate, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.CreationDate)));
            CreateMap<Offer, GetUserOffers>()
                .ForMember(dest => dest.Photo, opt=>opt.MapFrom(src => src.IconPhoto))
                .ForMember(dest => dest.CreationDate, opt=>opt.MapFrom(src => DateOnly.FromDateTime(src.CreationDate)));
            CreateMap<User, BasicUser>()
                .ForMember(dest => dest.CreationDate, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.CreationDate)));
            CreateMap<Category, BasicCategory>();
        }
    }
}
