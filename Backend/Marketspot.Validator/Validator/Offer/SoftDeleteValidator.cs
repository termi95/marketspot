using FluentValidation;
using Marketspot.Model.Offer;

namespace Marketspot.Validator.Validator.Offer
{
    internal class SoftDeleteValidator : AbstractValidator<SoftDeleteDto>
    {
        public SoftDeleteValidator()
        {
            RuleFor(x => x.Id)
                    .Cascade(CascadeMode.Stop)
                    .Custom((x, context) =>
                    {
                        if (!string.IsNullOrEmpty(x))
                        {
                            if (!Guid.TryParse(x, out Guid value))
                            {
                                context.AddFailure($"{x} is not in valid format.");
                            }
                        }
                    });
        }
    }
}
