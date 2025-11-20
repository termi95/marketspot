using AutoMapper;
using Marketspot.DataAccess.Entities;
using Marketspot.Model;
using Marketspot.Model.Offer;
using Marketspot.Validator;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Npgsql;
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

        public async Task<ApiResponse> Update(UpdateOfferDto dto, string userId)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            Offer offer = await _context.Offers.SingleOrDefaultAsync(x => x.Id == Guid.Parse(dto.Id) && x.User.Id == Guid.Parse(userId));

            if (!ValidatorHelper.CheckIfExists(offer, response))
            {
                return response;
            }
            Category category = await _context.Categories.SingleOrDefaultAsync(x => x.Id == Guid.Parse(dto.CategoryId));

            offer.Tittle = dto.Tittle;
            offer.Description = dto.Description;
            offer.Price = dto.Price;
            offer.Photos = dto.Photos;
            offer.IconPhoto = offer.Photos[0];
            offer.Category = category is null ? offer.Category : category;

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
                if (dto.Id is null)
                {
                    response.SetStatusCode(HttpStatusCode.OK);
                    response.Result = null;
                    return response;
                }

                Guid offerId = Guid.Parse(dto.Id);
                Offer offer = await _context.Offers.AsNoTracking().Include(o => o.User).Include(c => c.Category).FirstOrDefaultAsync(x => x.Id == offerId && x.SoftDeletedDate == null);

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
                    .Include(c => c.Likes.Where(x => x.UserId == Guid.Parse(idOfLoginUser)))
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
        public async Task<ApiResponse> GetRecentOffers(OfferQueryDto dto, string idOfLoginUser)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            Guid loginUserId = Guid.Empty;
            if (!string.IsNullOrEmpty(idOfLoginUser))
            {
                Guid.TryParse(idOfLoginUser, out loginUserId);
            }

            int take = 2;
            int skip = (dto.Page - 1) * take;
            try
            {
                IQueryable<Offer> offers;
                if (!string.IsNullOrEmpty(dto.CategoryId) && dto.CategoryId != Guid.Empty.ToString())
                {
                    var sql = @"
                                WITH RECURSIVE descendants AS (
                                    SELECT c.""Id"", c.""ParentId""
                                    FROM ""Categories"" c
                                    WHERE c.""Id"" = @categoryId

                                    UNION ALL

                                    SELECT ch.""Id"", ch.""ParentId""
                                    FROM ""Categories"" ch
                                    JOIN descendants d ON ch.""ParentId"" = d.""Id""
                                )
                                SELECT o.*
                                FROM ""Offers"" o
                                JOIN descendants d ON o.""CategoryId"" = d.""Id""
                            ";

                    var p = new NpgsqlParameter("categoryId", Guid.Parse(dto.CategoryId));

                    offers = _context.Offers
                        .FromSqlRaw(sql, p)
                        .Include(o => o.User)
                        .Include(o => o.Likes.Where(l => l.UserId == loginUserId));
                }
                else
                {
                    offers = _context.Offers.Include(c => c.Likes.Where(x => x.UserId == loginUserId)).Include(o => o.User).AsQueryable();
                }

                if (dto.MinPrice.HasValue)
                {
                    offers = offers.Where(p => p.Price >= dto.MinPrice.Value);
                }

                if (dto.MaxPrice.HasValue)
                {
                    offers = offers.Where(p => p.Price <= dto.MaxPrice.Value);
                }

                if (!string.IsNullOrEmpty(dto.SearchText))
                {
                    offers = offers.Where(x => EF.Functions.ToTsVector(x.Tittle + " " + x.Description).Matches(EF.Functions.PhraseToTsQuery(dto.SearchText)));
                }


                offers = SortBy(offers, dto);

                response.SetStatusCode(HttpStatusCode.OK);
                var result = await offers
                    .Skip(skip)
                    .Take(take)
                    .ToListAsync();
                response.Result = _mapper.Map<List<GetUserOffers>>(result);
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
        public async Task<ApiResponse> GetCheckoutOffer(CheckoutOfferDto dto, string userId)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            try
            {
                Checkout offer = await _context.Offers.AsNoTracking().Where(x => x.Id == Guid.Parse(dto.Id)).Select(x => new Checkout() { CreationDate = DateOnly.FromDateTime(x.CreationDate), Tittle = x.Tittle, Photo = x.IconPhoto, Id = x.Id, Price = x.Price, Description = x.Description }).FirstOrDefaultAsync();

                if (offer == null)
                {
                    response.ErrorsMessages.Add("Offer not found");
                    response.SetStatusCode(HttpStatusCode.NotFound);
                    return response;
                }

                response.Result = offer;
                response.SetStatusCode(HttpStatusCode.OK);
                return response;
            }
            catch (Exception e)
            {
                response.ErrorsMessages.Add(e.Message);
                return response;
            }
        }
        private IQueryable<Offer> SortBy(IQueryable<Offer> offers, OfferQueryDto dto)
        {
            return dto.SortBy switch
            {
                "PriceDesc" => offers.OrderByDescending(p => p.Price),
                "PriceAsc" => offers.OrderBy(p => p.Price),
                "CreatedDateDesc" => offers.OrderByDescending(p => p.CreationDate),
                "CreatedDateAsc" => offers.OrderBy(p => p.CreationDate),
                "SearchTextDesc" => offers.OrderByDescending(x => x.Tittle),
                "SearchTextAsc" => offers.OrderBy(x => x.Tittle),
                _ => offers.OrderByDescending(p => p.CreationDate)
            };
        }
        private List<Guid> GetCategoryHierarchyInternal(IEnumerable<Category> categories, Guid parentId)
        {
            var result = new List<Guid> { parentId };

            var children = categories.Where(c => c.ParentId == parentId).ToList();
            foreach (var child in children)
            {
                result.AddRange(GetCategoryHierarchyInternal(categories, child.Id));
            }

            return result;
        }
        public async Task<ApiResponse> GetBoughtOffers(string userId)
        {
            var response = new ApiResponse();

            List<Offer> offers = await _context.Orders.AsNoTracking().Include(i => i.Offer).Where(x => x.BuyerId == Guid.Parse(userId) && x.Offer.IsBought == true).Select(x => x.Offer).ToListAsync();
            response.Result = _mapper.Map<List<GetUserOffers>>(offers);
            response.SetStatusCode(HttpStatusCode.OK);
            return response;
        }
    }
}
