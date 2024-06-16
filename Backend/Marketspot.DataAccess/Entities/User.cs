using Marketspot.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using static Marketspot.Model.User.UserEnum;

namespace backend.Entities
{
    [Index(nameof(Email), IsUnique = true)]
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        [NotNull, MaxLength(128)]
        public string Name { get; set; }
        [AllowNull, MaxLength(128)]
        public string Surname { get; set; }
        [MaxLength(128), NotNull]
        public string Email { get; set; }
        [NotNull]
        public string Password { get; set; }
        [AllowNull]
        public Guid PasswordChangeToken { get; set; }
        [AllowNull]
        public DateTime PasswordAllowTimeToChange { get; set; } = DateTime.MinValue;

        [NotNull]
        public UserRoles Roles { get; set; } = UserRoles.User;

        public List<Offer> Offers { get; set; }

    }
}
