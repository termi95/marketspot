using Marketspot.Model.Category;
using Marketspot.Model.User;

namespace Marketspot.Model.Offer
{
    public class GetUserOffers
    {
        public Guid Id { get; set; }
        public string Tittle { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public string Photo { get; set; }

        public BasicUser User { get; set; }
        public BasicCategory Category { get; set; }
    }
}
