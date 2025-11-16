using backend;
using backend.Services;
using Backend;
using Backend.Services;
using Marketspot.DataAccess.Entities;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"🔍 Connection String: {connectionString}");

var authenticationSettings = new AuthenticationSettings();
builder.Configuration.GetSection("Authentication").Bind(authenticationSettings);
builder.Services.AddSingleton(authenticationSettings);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "Bearer";
    options.DefaultScheme = "Bearer";
    options.DefaultChallengeScheme = "Bearer";
}).AddJwtBearer(cfg =>
{
    cfg.RequireHttpsMetadata = false;
    cfg.SaveToken = true;
    cfg.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = authenticationSettings.JwtIssuer,
        ValidAudience = authenticationSettings.JwtIssuer,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authenticationSettings.JwtKey!)),
    };
}).AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
        options => builder.Configuration.Bind("CookieSettings", options));
// Add services to the container.
builder.Services.AddAutoMapper(typeof(MappingConfig));
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<UserServices>();
builder.Services.AddScoped<OrderServices>();
builder.Services.AddScoped<CategoryServices>();
builder.Services.AddScoped<OfferServices>();
builder.Services.AddScoped<LikeServices>();
builder.Services.AddScoped<AddressServices>();
builder.Services.AddControllers().AddJsonOptions(x =>
   {
       x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
       x.JsonSerializerOptions.WriteIndented = true;
   });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(o =>
       {
           o.AddSecurityDefinition(
            name: JwtBearerDefaults.AuthenticationScheme,
            securityScheme:
                new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Description = "Enter the bearer Authorization: `Bearer Generated-JWT-Token`",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });
           o.AddSecurityRequirement(new OpenApiSecurityRequirement
           {
              {
                   new OpenApiSecurityScheme
                   {
                       Reference = new OpenApiReference
                       {
                           Type = ReferenceType.SecurityScheme,
                           Id = JwtBearerDefaults.AuthenticationScheme
                       }
                   },
                   []
               }
           });
       }
    );
builder.Services.AddDbContext<UserDbContext>(options => options.UseNpgsql(connectionString, b => b.MigrationsAssembly("Marketspot.DataAccess")));
builder.Services.AddCors(options => options.AddPolicy("FrontEndClient", builder => builder.AllowAnyMethod().AllowAnyHeader().WithOrigins([ "http://127.0.0.1:5173", "http://localhost:5173", "http://127.0.0.1:7149", "http://localhost:7149", "https://localhost:7149"])));

var app = builder.Build();

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
app.UseCors("FrontEndClient");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true"));
    app.ApplyMigrations();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
