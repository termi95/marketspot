using backend.Model.User;
using FluentValidation;

namespace Marketspot.Validator.Validator.User
{
    public class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequestDto>
    {
        public ChangePasswordRequestValidator()
        {
            RuleFor(x => x.Email)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .MaximumLength(128)
                .EmailAddress();
        }
    }
}
