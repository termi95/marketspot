using Marketspot.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace backend.Entities
{
    [Index(nameof(Name), IsUnique = true)]
    public class Category
    {
        [Key]
        public Guid Id { get; set; }

        [Required, AllowNull]
        public Guid ParentId { get; set; }

        [NotNull, MaxLength(128) ]
        public string Name { get; set; }

        public List<Offer> Offers { get; set; }

    }
}
