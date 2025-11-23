using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Marketspot.DataAccess.Entities
{
    public enum DeliveryType
    {
        Shipping,
        LocalPickup
    }
    public enum Condytion
    {
        New,
        Used,
    }
    [Owned]
    public class PickupAddress
    {
        public string Street { get; set; }
        public string City { get; set; }
        public string Phone { get; set; }
    }
    public class Offer
    {
        [Key]
        public Guid Id { get; set; }

        [MaxLength(512), NotNull]
        public string Tittle { get; set; }

        [NotNull]
        public string Description { get; set; }
        [NotNull]
        public int Price { get; set; }
        public DateTime? SoftDeletedDate { get; set; } = null;
        public bool IsBought { get; set; } = false;
        [NotNull, MinLength(1)]
        public List<string> Photos { get; set; }
        public string IconPhoto { get; set; }
        public Condytion Condytion { get; set; }
        public PickupAddress PickupAddress { get; set; }
        public DeliveryType DeliveryType { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;

        public virtual User User { get; set; }
        public virtual Category Category { get; set; }
        public virtual ICollection<Like> Likes { get; set; }

    }
}
