namespace Marketspot.Model.Offer
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
    public class PickupAddress
    {
        public string Street { get; set; }
        public string City { get; set; }
        public string Phone { get; set; }
    }
    public class AddOfferDto
    {
        public string Tittle { get; set; }
        public string Description { get; set; }
        public string CategoryId { get; set; }
        public int Price { get; set; }
        public DeliveryType DeliveryType { get; set; }
        public Condytion Condytion { get; set; }
        public PickupAddress PickupAddress { get; set; }
        public List<string> Photos { get; set; }
    }
}
