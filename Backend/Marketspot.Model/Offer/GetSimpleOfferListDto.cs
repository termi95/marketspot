namespace Marketspot.Model.Offer
{
    public class OfferQueryDto
    {
        public int Page { get; set; }
        public string SearchText { get; set; }
        public int ItemPerPage { get; set; }
        public string SortBy { get; set; }
        public string CategoryId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public DeliveryType? DeliveryType { get; set; }
        public Condytion? Condytion { get; set; }
    }
}
