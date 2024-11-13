using System.ComponentModel.DataAnnotations;

namespace Marketspot.DataAccess.Entities
{
    public class Like
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public Guid OfferId { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public virtual User User { get; set; }
        public virtual Offer Offer { get; set; }
    }
}
