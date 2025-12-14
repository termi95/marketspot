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
                .Must(x => string.IsNullOrEmpty(x) || Guid.TryParse(x, out _))
                .WithMessage("ParentId must be a valid GUID format.");
        }
    }
}
