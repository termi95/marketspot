using Marketspot.Model.Category;
using Marketspot.Model.User;

namespace Marketspot.Model.Offer
{
    public class GetUserOffers
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid LikeId { get; set; }
        public string Tittle { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public string Photo { get; set; }
        public DateOnly CreationDate { get; set; }

        public BasicUser User { get; set; }
        public BasicCategory Category { get; set; }
        public bool IsLiked { get; set; }
        public int LikesCount { get; set; }
        public DeliveryType DeliveryType { get; set; }
        public Condytion Condytion { get; set; }
    }
}
