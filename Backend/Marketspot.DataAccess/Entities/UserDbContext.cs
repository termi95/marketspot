using Microsoft.EntityFrameworkCore;

namespace backend.Entities
{
    public class UserDbContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            User user = new User() { Id = Guid.NewGuid(), Email = "admin@admin.pl", Name = "admin", Roles = Marketspot.Model.User.UserEnum.UserRoles.Admin, Surname = "Jefe", Password = "AQAAAAIAAYagAAAAEFMvOOAzL4k+idqThNAhbif3uTKHFGYjJVUukDKgnRyC/rHbd8+eRrCr5xOMKFksXA==" };
            modelBuilder.Entity<User>().HasData(user);
        }
    }
}
