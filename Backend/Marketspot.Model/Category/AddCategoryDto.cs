namespace Marketspot.Model.Category
{
    public class AddCategoryDto
    {
        public Guid ParentId { get; set; }
        public string Name { get; set; }
    }
}
