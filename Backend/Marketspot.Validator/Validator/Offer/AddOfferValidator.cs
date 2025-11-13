using FluentValidation;
using Marketspot.Model.Offer;

namespace Marketspot.Validator.Validator.Offer
{
    internal class AddOfferValidator : AbstractValidator<AddOfferDto>
    {
        public AddOfferValidator()
        {
            RuleFor(x => x.Tittle)
                .Cascade(CascadeMode.Stop)
                .MaximumLength(128)
                .MinimumLength(3);
            RuleFor(x => x.Description)
                .Cascade(CascadeMode.Stop)
                .MaximumLength(512);
            RuleFor(x => x.Price)
                .Cascade(CascadeMode.Stop)
                .GreaterThanOrEqualTo(0);
            RuleFor(x => x.Photos)
                .Cascade(CascadeMode.Stop)
                .NotEmpty();
            RuleFor(x => x.CategoryId)
                .Cascade(CascadeMode.Stop)
                .Custom((x, context) =>
                {
                    if (string.IsNullOrEmpty(x))
                    {
                        context.AddFailure("Id cannot be null or empty.");
                    }
                    else if (!Guid.TryParse(x, out Guid value))
                    {
                        context.AddFailure($"{x} is not in a valid GUID format.");
                    }
                });
        }
    }
}
