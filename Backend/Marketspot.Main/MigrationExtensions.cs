using Marketspot.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend
{
    public static class MigrationExtensions
    {
        public static void ApplyMigrations(this IApplicationBuilder app)
        {
            using IServiceScope scope = app.ApplicationServices.CreateScope();

            using UserDbContext dbContext = scope.ServiceProvider.GetRequiredService<UserDbContext>();
            //dbContext.Database.EnsureCreated();
            dbContext.Database.Migrate();
        }
    }
}
