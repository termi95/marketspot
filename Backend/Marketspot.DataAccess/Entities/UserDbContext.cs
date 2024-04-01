using Microsoft.EntityFrameworkCore;

namespace backend.Entities
{
    public class UserDbContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
    }
}
