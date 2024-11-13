using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Marketspot.DataAccess.Entities
{
    public class Offer
    {
        [Key]
        public Guid Id { get; set; }

        [MaxLength(128), NotNull]
        public string Tittle { get; set; }

        [MaxLength(512), NotNull]
        public string Description { get; set; }
        [NotNull]
        public int Price { get; set; }
        public DateTime? SoftDeletedDate { get; set; } = null;
        [NotNull, MinLength(1)]
        public List<string> Photos { get; set; }
        public string IconPhoto { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;

        public virtual User User { get; set; }
        public virtual Category Category { get; set; }
        public virtual ICollection<Like> Likes { get; set; }

    }
}
