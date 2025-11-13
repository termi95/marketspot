using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Marketspot.DataAccess.Entities
{
    public class Address
    {
        [Key]
        public Guid Id { get; set; }
        [NotNull]
        public string Name { get; set; }
        [NotNull]
        public string Street { get; set; }
        [NotNull]
        public string City { get; set; }
        [NotNull]
        public string Country { get; set; } = "PL";
        [NotNull]
        public string Phone { get; set; }
        [NotNull]
        public Guid UserId { get; set; }
        public User User { get; set; }
    }
}
