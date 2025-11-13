namespace Marketspot.Model.Offer
{
    public class Checkout
    {
        public Guid Id { get; set; }
        public string Tittle { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public string Photo { get; set; }
        public DateOnly CreationDate { get; set; }
    }
}
