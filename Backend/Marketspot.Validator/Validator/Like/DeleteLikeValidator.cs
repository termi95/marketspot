using FluentValidation;
using Marketspot.Model.Like;

namespace Marketspot.Validator.Validator.Like
{
    internal class DeleteLikeValidator : AbstractValidator<DeleteLikeDto>
    {
        public DeleteLikeValidator()
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
