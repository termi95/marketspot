using AutoMapper;
using backend.Entities;
using backend.Model.User;
using Marketspot.Model;
using Marketspot.Validator.Validator;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Services
{
    public class UserService(UserDbContext context, IPasswordHasher<User> passwordHasher, AuthenticationSettings authenticationSettings, IMapper mapper)
    {
        private readonly UserDbContext _context = context;
        private readonly IPasswordHasher<User> _passwordHasher = passwordHasher;
        private readonly AuthenticationSettings _authenticationSettings = authenticationSettings;
        private readonly IMapper _mapper = mapper;

        public async Task<ApiResponse> Register(RegisterUserDto dto)
        {
            var response = new ApiResponse();
            var registerValidator = new RegisterUserValidator();
            var validation = await registerValidator.ValidateAsync(dto);
            if (!validation.IsValid)
            {
                response.ErrorsMessages.AddRange(validation.Errors.Select(x => x.ErrorMessage));
                return response;
            }

            bool isEmailTaken = await _context.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Email == dto.Email) is not null;
            if (isEmailTaken)
            {
                response.ErrorsMessages.Add($"Email \"{dto.Email}\" is taken.");
                return response;
            }

            var user = _mapper.Map<User>(dto);
            user.Password = _passwordHasher.HashPassword(user, dto.Password);

            await _context.Users.AddAsync(user);
            try
            {
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                response.ErrorsMessages.Add(ex.Message);
                return response;
            }
            response.IsSuccess = true;
            response.StatusCode = System.Net.HttpStatusCode.Created;
            return response;
        }

        public string Login(LoginUserDto dto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            //if (_passwordHasher.VerifyHashedPassword(user, user.Password, dto.Password) is PasswordVerificationResult.Failed)
            //{
            //    throw new BadRequestException("User or password are incorrect.");
            //}

            var claims = new List<Claim>()
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.Name.ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authenticationSettings.JwtKey!));
            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
            var expires = DateTime.Now.AddDays(_authenticationSettings.JwtExpireDays);

            var token = new JwtSecurityToken(_authenticationSettings.JwtIssuer,
                _authenticationSettings.JwtIssuer,
                claims,
                expires: expires,
                signingCredentials: signingCredentials);

            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(token);
        }
    }
}
