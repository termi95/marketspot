using FluentValidation;
using Marketspot.Model.Order;

namespace Marketspot.Validator.Validator.Order
{
    public enum PaymentMethod
    {
        Unknown = 0,
        CashOnDelivery,
        BankTransfer,
        Card,
        Blik,
        Paypal
    }
    public enum DeliveryMethod
    {
        Dpd,
        Inpost,
        Poczta,
        Orlen
    }

    public class OrderValidator : AbstractValidator<OrderDto>
    {
        public OrderValidator()
        {
            RuleFor(x => x.AddressId)
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
            RuleFor(x => x.PaymentMethod)
                    .Cascade(CascadeMode.Stop)
                    .Custom((x, context) =>
                    {
                        if (string.IsNullOrEmpty(x))
                        {
                            context.AddFailure("Id cannot be null or empty.");
                        }
                        else if (!Enum.TryParse<PaymentMethod>(x, out var payment))
                        {
                            context.AddFailure($"{x} is not a valid payment method.");
                        }
                    });
            RuleFor(x => x.DeliveryMethod)
                    .Cascade(CascadeMode.Stop)
                    .Custom((x, context) =>
                    {
                        if (string.IsNullOrEmpty(x))
                        {
                            context.AddFailure("Id cannot be null or empty.");
                        }
                        else if (!Enum.TryParse<DeliveryMethod>(x, out var delivery))
                        {
                            context.AddFailure($"{x} is not a valid delivery method.");
                        }
                    });
        }
    }
}
