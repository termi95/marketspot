using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Marketspot.DataAccess.Entities
{
    internal sealed class OfferConfiguration : IEntityTypeConfiguration<Offer>
    {
        public void Configure(EntityTypeBuilder<Offer> builder) 
        {
            builder.HasIndex(x=> new { x.Tittle, x.Description })
                .HasMethod("GIN")
                .IsTsVectorExpressionIndex("polish");
        }
    }
}
