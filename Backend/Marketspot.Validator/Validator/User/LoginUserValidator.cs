﻿using FluentValidation;
using Marketspot.Model.User;

namespace Marketspot.Validator.Validator.User
{
    public class LoginUserValidator : AbstractValidator<LoginUserDto>
    {
        public LoginUserValidator()
        {
            RuleFor(x => x.Email)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .MaximumLength(128)
                .EmailAddress();
            RuleFor(x => x.Password)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .MinimumLength(8);
        }
    }
}
