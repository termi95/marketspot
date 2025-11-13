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
            CreateMap<UpsertAddressDto, Category>();
            CreateMap<AddOfferDto, Offer>();
            CreateMap<Offer, GetOfferByIdResult>()
                .ForMember(dest => dest.CreationDate, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.CreationDate)));
            CreateMap<Offer, GetUserOffers>()
                .ForMember(dest => dest.Photo, opt=>opt.MapFrom(src => src.IconPhoto))
                .ForMember(dest => dest.LikeId, opt=>opt.MapFrom(src => src.Likes.FirstOrDefault(x=> x.OfferId == src.Id).Id))
                .ForMember(dest => dest.CreationDate, opt=>opt.MapFrom(src => DateOnly.FromDateTime(src.CreationDate)));
            CreateMap<User, BasicUser>()
                .ForMember(dest => dest.CreationDate, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.CreationDate)));
            CreateMap<Category, BasicCategory>();
            CreateMap<Like, GetUserOffers>()
                .ForMember(dest => dest.LikeId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Photo, opt => opt.MapFrom(src => src.Offer.IconPhoto))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Offer.Id))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Offer.Description))
                .ForMember(dest => dest.Tittle, opt => opt.MapFrom(src => src.Offer.Tittle))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Offer.Price))
                .ForMember(dest => dest.CreationDate, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.Offer.CreationDate)));
        }
    }
}
