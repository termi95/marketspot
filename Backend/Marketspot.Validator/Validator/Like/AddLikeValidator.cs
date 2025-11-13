using FluentValidation;
using Marketspot.Model.Like;

namespace Marketspot.Validator.Validator.Like
{
    internal class AddLikeValidator : AbstractValidator<AddLikeDto>
    {
        public AddLikeValidator()
        {
            RuleFor(x => x.OfferId)
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
