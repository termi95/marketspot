using FluentValidation;
using Marketspot.Model.Category;

namespace Marketspot.Validator.Validator.Category
{
    internal class GetCategoryValidator : AbstractValidator<GetCategoryDto>
    {
        public GetCategoryValidator()
        {
            RuleFor(x => x.ParentId)
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
