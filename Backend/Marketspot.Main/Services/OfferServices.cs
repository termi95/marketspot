using AutoMapper;
using Marketspot.DataAccess.Entities;
using Marketspot.DataAccess.Migrations;
using Marketspot.Model;
using Marketspot.Model.Offer;
using Marketspot.Validator;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Backend.Services
{
    public class OfferServices(UserDbContext context, IPasswordHasher<User> passwordHasher, IMapper mapper)
    {
        private readonly UserDbContext _context = context;
        private readonly IMapper _mapper = mapper;
        private readonly IPasswordHasher<User> _passwordHasher = passwordHasher;
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
            response.Result = offer.Id;
            return response;
        }

        public async Task<ApiResponse> GetOfferById(GetOfferByIdDto dto, string userId)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            try
            {
                var offer = await _context.Offers.AsNoTracking().Include(o => o.User).Include(c => c.Category).FirstOrDefaultAsync(x => x.Id == Guid.Parse(dto.Id) && x.SoftDeletedDate == null);

                if (!ValidatorHelper.CheckIfExists(offer, response))
                {
                    return response;
                }
                var result = _mapper.Map<GetOfferByIdResult>(offer);
                result.LikeId = string.IsNullOrEmpty(userId) ? Guid.Empty : await _context.Likes.Where(l => l.OfferId == offer.Id && l.UserId == Guid.Parse(userId)).Select(l => l.Id).SingleOrDefaultAsync();
                response.SetStatusCode(HttpStatusCode.OK);
                response.Result = result;
                return response;
            }
            catch (Exception e)
            {
                response.ErrorsMessages.Add(e.Message);
                return response;
            }
        }

        public async Task<ApiResponse> GetUserOffers(string Id, string idOfLoginUser)
        {
            var response = new ApiResponse();
            if (string.IsNullOrEmpty(idOfLoginUser))
            {
                idOfLoginUser = Guid.Empty.ToString();
            }

            try
            {
                var offers = await _context
                    .Offers.AsNoTracking()
                    .Include(o => o.User)
                    .Include(c => c.Category)
                    .Include(c => c.Likes.Where(x=> x.UserId == Guid.Parse(idOfLoginUser)))
                    .Where(x => x.User.Id == Guid.Parse(Id) && x.SoftDeletedDate == null)
                    .ToListAsync();

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
        public async Task<ApiResponse> GetRecentOffers(GetSimpleOfferListDto dto, string idOfLoginUser)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            if (string.IsNullOrEmpty(idOfLoginUser))
            {
                idOfLoginUser = Guid.Empty.ToString();
            }

            int skip = 1 * (-1 + dto.Page);
            int take = 3;

            try
            {
                var offers = await _context
                    .Offers.AsNoTracking()
                    .Include(o => o.User)
                    .Include(c => c.Category)
                    .Include(c => c.Likes.Where(x => x.UserId == Guid.Parse(idOfLoginUser)))
                    .Where(x => x.SoftDeletedDate == null)
                    .OrderBy(x => x.CreationDate)
                    .Skip(skip)
                    .Take(take)
                    .ToListAsync();

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
        public async Task<ApiResponse> SoftDelete(SoftDeleteDto dto, string userId)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            var user = await _context.Users.Where(x => x.Id == Guid.Parse(userId)).SingleOrDefaultAsync();

            if (user is null)
            {
                response.ErrorsMessages.Add("User not found.");
                return response;
            }

            if (_passwordHasher.VerifyHashedPassword(user, user.Password, dto.Password) is PasswordVerificationResult.Failed)
            {
                response.ErrorsMessages.Add("Password was incorrect.");
                return response;
            }

            try
            {
                var offers = await _context.Offers.AsNoTracking().Where(x => x.Id == Guid.Parse(dto.Id) && x.User.Id == Guid.Parse(userId)).FirstOrDefaultAsync();

                if (offers == null)
                {
                    response.ErrorsMessages.Add("Offer not found");
                    response.SetStatusCode(HttpStatusCode.NotFound);
                    return response;
                }

                await _context.Offers.Where(x => x.Id == offers.Id && x.User.Id == Guid.Parse(userId)).ExecuteUpdateAsync(u => u.SetProperty(p => p.SoftDeletedDate, DateTime.Now));

                response.SetStatusCode(HttpStatusCode.OK);
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
