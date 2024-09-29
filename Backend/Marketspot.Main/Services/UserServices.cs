using AutoMapper;
using backend.Model.User;
using Backend.Helper;
using Marketspot.DataAccess.Entities;
using Marketspot.EmailSender;
using Marketspot.Model;
using Marketspot.Model.User;
using Marketspot.Validator;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
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
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
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
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                response.ErrorsMessages.Add(ex.Message);
                return response;
            }
            response.SetStatusCode(HttpStatusCode.Created);
            return response;
        }

        public async Task<ApiResponse> Login(LoginUserDto dto)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user is null)
            {
                response.ErrorsMessages.Add("User not found or Password was incorrect.");
                return response;
            }
            if (_passwordHasher.VerifyHashedPassword(user, user.Password, dto.Password) is PasswordVerificationResult.Failed)
            {
                response.ErrorsMessages.Add("Password was incorrect.");
                return response;
            }
            var claims = new List<Claim>()
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.Name.ToString()),
                new(ClaimTypes.Role, Convert.ChangeType(user.Roles, user.Roles.GetTypeCode()).ToString()),
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
            response.SetStatusCode(HttpStatusCode.OK);
            response.Result = tokenHandler.WriteToken(token);
            return response;
        }

        public async Task<ApiResponse> ChangePasswordRequest(ChangePasswordRequestDto dto)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user is null)
            {
                response.ErrorsMessages.Add("User not found.");
                return response;
            }
            user.PasswordChangeToken = Guid.NewGuid();
            user.PasswordAllowTimeToChange = DateTime.Now.AddHours(2);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                response.ErrorsMessages.Add(ex.Message);
                return response;
            }

            var Config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            var appLink = Config.GetValue<string>("App:Link") + "change-password/" + user.PasswordChangeToken;
            var body = $"<b>Hello you can change your password with the link below.</b><br />{appLink}";
            await Email.SendMail(Helper.GetEmailConfig(), user.Email, body);
            response.SetStatusCode(HttpStatusCode.OK);
            return response;
        }
        public async Task<ApiResponse> ChangePassword(ChangePasswordDto dto)
        {
            var response = new ApiResponse();
            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }
            User user = null;

            try
            {
                user = await _context.Users.FindAsync(dto.PasswordChangeToken);
            }
            catch { }

            if (user is null || user.PasswordAllowTimeToChange > DateTime.Now)
            {
                response.ErrorsMessages.Add("User not found or time to change password expire.");
                return response;
            }
            user.Password = _passwordHasher.HashPassword(user, dto.Password);
            user.PasswordAllowTimeToChange = DateTime.MinValue;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                response.ErrorsMessages.Add(ex.Message);
                return response;
            }
            response.SetStatusCode(HttpStatusCode.OK);
            return response;
        }

        public async Task<ApiResponse> GetPersonalInfo(string userId)
        {
            var response = new ApiResponse();
            User user = null;

            user = await _context.Users.Where(x => x.Id == Guid.Parse(userId)).SingleOrDefaultAsync();

            if (user is null)
            {
                response.ErrorsMessages.Add("User not found.");
                return response;
            }

            response.Result = _mapper.Map<BasicUser>(user);
            response.SetStatusCode(HttpStatusCode.OK);
            return response;
        }

        public async Task<ApiResponse> UpdateSettingsChangePassword(string  userId, SettingsChangePasswordDto dto)
        {
            var response = new ApiResponse();
            User user = null;

            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            user = await _context.Users.Where(x => x.Id == Guid.Parse(userId)).SingleOrDefaultAsync();

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
            user.Password = _passwordHasher.HashPassword(user, dto.NewPassword);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                response.ErrorsMessages.Add(ex.Message);
                return response;
            }
            response.SetStatusCode(HttpStatusCode.OK);
            return response;
        }


        public async Task<ApiResponse> UpdateSettingsPersonalInformation(string userId, SettingsPersonalInformationDto dto)
        {
            var response = new ApiResponse();
            User user = null;

            if (!await ValidatorHelper.ValidateDto(dto, response))
            {
                return response;
            }

            user = await _context.Users.Where(x => x.Id == Guid.Parse(userId)).SingleOrDefaultAsync();

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

            user.Surname = dto.Surname;
            user.Name = dto.Name;
            user.Email = dto.Email;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                response.ErrorsMessages.Add(ex.Message);
                return response;
            }
            response.SetStatusCode(HttpStatusCode.OK);
            return response;
        }
    }
}