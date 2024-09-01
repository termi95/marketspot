namespace Marketspot.Model.Category
{
    public class BasicCategory
    {
        public Guid Id { get; set; }
        public Guid ParentId { get; set; }
        public string Name { get; set; }
    }
}
