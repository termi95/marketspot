namespace Marketspot.Model.Offer
{
    public class AddOfferDto
    {
        public string Tittle { get; set; }
        public string Description { get; set; }
        public string CategoryId { get; set; }
        public int Price { get; set; }
        public List<string> Photos { get; set; }
    }
}
