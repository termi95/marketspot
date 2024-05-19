using FluentValidation;
using Marketspot.Model.Category;

namespace Marketspot.Validator.Validator.Category
{
    internal class DeleteCategoryValidator : AbstractValidator<DeleteCategoryDto>
    {
        public DeleteCategoryValidator()
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
