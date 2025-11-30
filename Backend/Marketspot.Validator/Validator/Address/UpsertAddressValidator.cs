using FluentValidation;
using Marketspot.Model.Category;

namespace Marketspot.Validator.Validator.Address
{
    public class UpsertAddressValidator : AbstractValidator<UpsertAddressDto>
    {
        public UpsertAddressValidator()
        {
            RuleFor(x => x.Name)
                    .Cascade(CascadeMode.Stop)
                    .NotEmpty();

            RuleFor(x => x.City)
                    .Cascade(CascadeMode.Stop)
                    .NotEmpty();

            RuleFor(x => x.Street)
                    .Cascade(CascadeMode.Stop)
                    .NotEmpty();

            RuleFor(x => x.Phone)
                    .Cascade(CascadeMode.Stop)
                    .NotEmpty();
        }
    }
}
