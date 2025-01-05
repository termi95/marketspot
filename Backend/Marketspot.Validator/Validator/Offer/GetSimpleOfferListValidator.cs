using FluentValidation;
using Marketspot.Model.Offer;

namespace Marketspot.Validator.Validator.Offer
{
    internal class OfferQueryValidator : AbstractValidator<OfferQueryDto>
    {
        public OfferQueryValidator()
        {
            RuleFor(x => x.Page)
                .NotEmpty()
                .NotNull()
                .GreaterThanOrEqualTo(0);
        }
    }
}
