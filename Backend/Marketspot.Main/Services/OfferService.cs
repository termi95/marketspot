using AutoMapper;
using Marketspot.DataAccess.Entities;
using Marketspot.Model;
using Marketspot.Model.Offer;
using Marketspot.Validator;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Backend.Services
{
    public class OfferService(UserDbContext context, IMapper mapper)
    {
        private readonly UserDbContext _context = context;
        private readonly IMapper _mapper = mapper;
        public async Task<ApiResponse> AddOffer(AddOfferDto dto, string userId)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            Offer offer = _mapper.Map<Offer>(dto);
            offer.User = _context.Users.Find(Guid.Parse(userId));
            offer.Category = _context.Categories.Find(Guid.Parse(dto.CategoryId));
            offer.IconPhoto = offer.Photos[0];

            if (offer.User is null || offer.Category is null)
            {
                response.ErrorsMessages.Add("User or Category not found");
                return response;
            }

            await _context.Offers.AddAsync(offer);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                response.ErrorsMessages.Add(e.Message);
                return response;
            }

            response.SetStatusCode(HttpStatusCode.Created);
            response.Result = offer;
            return response;
        }

        public async Task<ApiResponse> GetOfferById(GetOfferByIdDto dto)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            try
            {
                var offer = await _context.Offers.AsNoTracking().Include(o => o.User).Include(c => c.Category).FirstOrDefaultAsync(x => x.Id == Guid.Parse(dto.Id));

                if (ValidatorHelper.CheckIfFound(offer, response))
                {
                    return response;
                }
                response.SetStatusCode(HttpStatusCode.OK);
                response.Result = _mapper.Map<GetOfferByIdResult>(offer);
                return response;
            }
            catch (Exception e)
            {
                response.ErrorsMessages.Add(e.Message);
                return response;
            }
        }

        public async Task<ApiResponse> GetUSerOffer(string Id)
        {
            var response = new ApiResponse();

            try
            {
                var offers = await _context.Offers.AsNoTracking().Include(o => o.User).Include(c => c.Category).Where(x => x.User.Id == Guid.Parse(Id)).ToListAsync();

                response.SetStatusCode(HttpStatusCode.OK);
                response.Result = _mapper.Map<List<GetUserOffers>>(offers);
                return response;
            }
            catch (Exception e)
            {
                response.ErrorsMessages.Add(e.Message);
                return response;
            }
        }
    }
}
