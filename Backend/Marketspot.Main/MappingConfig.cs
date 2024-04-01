using AutoMapper;
using backend.Entities;
using backend.Model.User;

namespace Backend
{
    public class MappingConfig : Profile
    {
        public MappingConfig()
        {
            CreateMap<RegisterUserDto, User>();
        }
    }
}
