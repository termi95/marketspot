using FluentValidation;
using Marketspot.Model.Offer;

namespace Marketspot.Validator.Validator.Offer
{
    internal class GetSimpleOfferListValidator : AbstractValidator<GetSimpleOfferListDto>
    {
        public GetSimpleOfferListValidator()
        {
            RuleFor(x => x.Page)
                .NotEmpty()
                .NotNull()
                .GreaterThanOrEqualTo(0);
        }
    }
}
