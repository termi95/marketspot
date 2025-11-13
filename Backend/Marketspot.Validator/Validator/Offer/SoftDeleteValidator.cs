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
