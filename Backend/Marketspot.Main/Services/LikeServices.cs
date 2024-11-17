using Marketspot.DataAccess.Entities;
using Marketspot.Model;
using Marketspot.Model.Like;
using Marketspot.Validator;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Backend.Services
{
    public class LikeServices(UserDbContext context)
    {
        private readonly UserDbContext _context = context;
        public async Task<ApiResponse> Add(AddLikeDto dto, string userId)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }
            Guid offerId = Guid.Parse(dto.OfferId);
            if (await _context.Offers.FirstOrDefaultAsync(x => x.Id == offerId && x.SoftDeletedDate == null) is null)
            {
                response.ErrorsMessages.Add("Offer not exist or is not active");
                return response;
            }
            if (await _context.Likes.Where(l => l.OfferId == offerId && l.UserId == Guid.Parse(userId)).Select(l => l.Id).SingleOrDefaultAsync() != Guid.Empty)
            {
                response.ErrorsMessages.Add("You already like this offer.");
                return response;
            }

            Like like = new() { OfferId = offerId, UserId = Guid.Parse(userId) };
            await _context.Likes.AddAsync(like);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                response.ErrorsMessages.Add(ex.InnerException is not null ? ex.InnerException.Message : ex.Message);
                return response;
            }

            response.SetStatusCode(HttpStatusCode.Created);
            response.Result = like.Id;
            return response;
        }
        public async Task<ApiResponse> Delete(DeleteLikeDto dto, string userId)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            Like like = await _context.Likes.FirstOrDefaultAsync(x => x.Id == Guid.Parse(dto.Id) && x.UserId == Guid.Parse(userId));

            if (like is null)
            {
                response.ErrorsMessages.Add("Like not found for that user.");
                response.SetStatusCode(HttpStatusCode.NotFound);
                return response;
            }
            
            _context.Likes.Remove(like);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                response.ErrorsMessages.Add(ex.InnerException is not null ? ex.InnerException.Message : ex.Message);
                return response;
            }

            response.SetStatusCode(HttpStatusCode.OK);
            return response;
        }
    }
}
