using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace backend.Entities
{
    [Index(nameof(Email))]
    public class User
    {
        [Key]
        public int Id { get; set; }
        [NotNull]
        public string Name { get; set; }
        [AllowNull]
        public string Surname { get; set; }
        [MaxLength(128), NotNull]
        public string Email { get; set; }
        [NotNull]
        public string Password { get; set; }

    }
}
