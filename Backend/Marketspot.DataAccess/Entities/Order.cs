using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Marketspot.DataAccess.Entities
{
    public enum PaymentMethod
    {
        Unknown = 0,
        CashOnDelivery,
        BankTransfer,
        Card,
        Blik,
        Paypal
    }
    public enum DeliveryMethod
    {
        Unknown = 0,
        Dpd,
        Inpost,
        Poczta,
        Orlen
    }

    [Owned]
    public class ShippingAddressValue
    {
        public string Street { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = "PL";
        public string Phone { get; set; } = string.Empty;
        public ShippingAddressValue(Address address)
        {
            Street = address.Street;
            City = address.City;
            Country = address.Country;
            Phone = address.Phone;
        }

        private ShippingAddressValue() { }
    }
    public class Order
    {
        [Key]
        public Guid Id { get; set; }
        [NotNull]
        public DateTime PurchasedAtUtc { get; set; } = DateTime.UtcNow;
        [NotNull]
        public PaymentMethod PaymentMethod { get; set; }
        public DeliveryMethod DeliveryMethodIdDeliveryMethod { get; set; }
        [NotNull]
        public Guid BuyerId { get; set; }
        [NotNull]
        public Guid SellerId { get; set; }
        [NotNull]
        public Guid OfferId { get; set; }
        [NotNull]
        public bool MarkAsBought { get; set; } = false;
        [NotNull] 
        public ShippingAddressValue ShippingAddress { get; set; }

        // Full Entities
        public User Buyer { get; set; }
        public User Seller { get; set; }
        public Offer Offer { get; set; }
    }
}
