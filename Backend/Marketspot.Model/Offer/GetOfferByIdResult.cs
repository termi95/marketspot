using Marketspot.Model.Category;
using Marketspot.Model.User;

namespace Marketspot.Model.Offer
{
    public class GetOfferByIdResult
    {
        public Guid Id { get; set; }
        public Guid? LikeId { get; set; }
        public DateOnly CreationDate { get; set; }
        public string Tittle { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public List<string> Photos { get; set; }

        public BasicUser User { get; set; }
        public BasicCategory Category { get; set; }
    }
}
