using backend.Model.User;
using FluentValidation;
using Marketspot.Validator.Validator.User;

namespace Marketspot.Validator.Validator
{
    public class SettingsPersonalInformationValidator :AbstractValidator<RegisterUserDto>
    {
        public SettingsPersonalInformationValidator()
        {
            RuleFor(x => x).SetValidator(new RegisterUserValidator());
        }
    }
}
