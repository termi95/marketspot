using Marketspot.DataAccess.Entities;
using Marketspot.Model;
using Marketspot.Model.Address;
using Marketspot.Model.Category;
using Marketspot.Validator;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Backend.Services
{
    public class AddressServices(UserDbContext context, IPasswordHasher<User> passwordHasher)
    {
        private readonly UserDbContext _context = context;
        private readonly IPasswordHasher<User> _passwordHasher = passwordHasher;
        public async Task<ApiResponse> Upsert(UpsertAddressDto dto, string userId)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            if (string.IsNullOrEmpty(dto.Id))
            {
                Address address = new Address()
                {
                    UserId = Guid.Parse(userId),
                    City = dto.City,
                    Country = dto.Country,
                    Name = dto.Name,
                    Phone = dto.Phone,
                    Street = dto.Street,
                };
                await _context.Addresses.AddAsync(address);
                try
                {
                    await _context.SaveChangesAsync();
                    response.SetStatusCode(HttpStatusCode.Created);
                    response.Result = address;
                    return response;
                }
                catch (Exception ex)
                {
                    response.ErrorsMessages.Add(ex.InnerException is not null ? ex.InnerException.Message : ex.Message);
                    return response;
                }

            }
            else
            {
                _ = Guid.TryParse(dto.Id, out Guid id);
                Address address = await _context.Addresses.FirstOrDefaultAsync(x => x.Id == id && x.UserId == Guid.Parse(userId));
                if (address is null)
                {
                    response.ErrorsMessages.Add("Address not found.");
                    return response;
                }

                address.Street = dto.Street;
                address.City = dto.City;
                address.Name = dto.Name;
                address.Phone = dto.Phone;
                address.Street = dto.Street;
                address.Country = dto.Country;

                try
                {
                    await _context.SaveChangesAsync();
                    response.SetStatusCode(HttpStatusCode.OK);
                    response.Result = address;
                    return response;
                }
                catch (Exception ex)
                {
                    response.ErrorsMessages.Add(ex.InnerException is not null ? ex.InnerException.Message : ex.Message);
                    return response;
                }

            }
        }

        public async Task<ApiResponse> GetAddress(string userId)
        {
            var response = new ApiResponse();

            response.Result = await _context.Addresses.Where(x => x.UserId == Guid.Parse(userId)).AsNoTracking().ToListAsync();
            response.SetStatusCode(HttpStatusCode.OK);
            return response;
        }

        public async Task<ApiResponse> DeleteAddress(DeleteAddressDto dto, string userId)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
                return response;

            var address = await _context.Addresses.FirstOrDefaultAsync(x => x.UserId == Guid.Parse(userId) && x.Id == Guid.Parse(dto.Id));

            if (!ValidatorHelper.CheckIfExists(address,response))
                return response;

            _context.Remove(address);
            await context.SaveChangesAsync();

            response.SetStatusCode(HttpStatusCode.OK);
            return response;
        }
    }
}
