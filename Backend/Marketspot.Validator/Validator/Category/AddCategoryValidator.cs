using FluentValidation;
using Marketspot.Model.Category;

namespace Marketspot.Validator.Validator.Category
{
    internal class AddCategoryValidator : AbstractValidator<AddCategoryDto>
    {
        public AddCategoryValidator()
        {
            RuleFor(x => x.Name)
                    .Cascade(CascadeMode.Stop)
                    .NotEmpty()
                    .MaximumLength(128)
                    .Matches("^[a-zA-Z]+$").WithMessage("'{PropertyName}' must contain one or more capital letters.");
        }
    }
}
