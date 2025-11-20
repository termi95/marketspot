import { Box, Fieldset, Group, Image, Radio, rem, SimpleGrid, Stack, Text, Textarea, TextInput } from "@mantine/core";
import Btn from "../../Components/Btn";
import { useEffect, useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { CheckoutOffer, DeliveryMethod, DeliveryMethodId } from "../../Types/Offer";
import { Address } from "../../Types/Address";
import { IconBarcode, IconBrandPaypal, IconBuilding, IconBuildingBank, IconCash, IconCreditCard, IconLabel, IconPackages, IconPhone } from "@tabler/icons-react";
import { Order } from "../../Types/Order";
import { useNavigate } from "react-router-dom";
import { INotyfication } from "../../Types/Notyfication";

interface Props {
    offer: CheckoutOffer;
}

type CheckoutState = {
    offer: CheckoutOffer | undefined;
    address: Address | undefined;
    deliveryMethodId: DeliveryMethodId | null;
    paymentMethod: PaymentMethodId | null;
}

export type PaymentMethodId = typeof paymentMethods[number]["id"];
const initState: CheckoutState = {
    offer: undefined,
    address: {
        id: "",
        userId: "",
        name: "",
        street: "",
        city: "",
        country: "",
        phone: ""
    },
    deliveryMethodId: "inpost",
    paymentMethod: "card"
}
const deliveryMethods: DeliveryMethod[] = [
    {
        id: "dpd",
        name: "DPD",
        description: "Courier delivery service",
        price: 15.99,
    },
    {
        id: "inpost",
        name: "InPost Locker 24/7",
        description: "Pick up at any InPost parcel locker or service point",
        price: 6.99,
    },
    {
        id: "poczta",
        name: "Polish Post",
        description: "Pick up at a post office, Żabka store, or Orlen station",
        price: 9.99,
    },
    {
        id: "orlen",
        name: "Orlen Paczka",
        description:
            "Pick up at Orlen parcel machines, RUCH kiosks, or partner locations",
        price: 7.99,
    },
];

const paymentMethods = [
    {
        id: "cash",
        name: "Cash on delivery",
        icon: IconCash,
    },
    {
        id: "bank",
        name: "Bank transfer",
        icon: IconBuildingBank,
    },
    {
        id: "card",
        name: "Credit / Debit card",
        icon: IconCreditCard,
    },
    {
        id: "blik",
        name: "Blik",
        icon: IconBarcode,
    },
    {
        id: "paypal",
        name: "PayPal",
        icon: IconBrandPaypal,
    },
] as const;
const sectionStyles = {
    legend: {
        fontWeight: 600,
        fontSize: rem(16),
        paddingInline: rem(4),
    },
    root: {
        marginBottom: rem(16),
        textAlign: "start",
        border: "none"
    },
} as const;

const radioStackStyles = {
    cursor: "pointer",
    borderRadius: rem(8),
    border: "1px solid var(--mantine-color-gray-3)",
    boxShadow: "none",
    backgroundColor: "white",
} as const;

const radioStackStylesChecked = {
    cursor: "pointer",
    borderRadius: rem(8),
    border: "1px solid var(--mantine-color-blue-5)",
    boxShadow: "0 0 0 1px var(--mantine-color-blue-1)",
    backgroundColor: "var(--mantine-color-blue-0)"
} as const;
const inputIconStyle = { width: rem(18), height: rem(18) };
const GetUserOffersEndpoint = "Address/get";
const CreateOrderEndpoint = "Order/create-order";

const OrderNotification: INotyfication = {
  Title: "Order",
  Message: "Creating Order.",
  SuccessMessage: "Your purchase was successful."
};
function CheckoutForm({ offer }: Props) {
    const navigate = useNavigate();
    const { PostRequest } = Api();
    const [data, setData] = useState<CheckoutState>({ ...initState, offer });
    const setDeliveryMethod = (id: DeliveryMethodId) => setData((prev) => ({ ...prev, deliveryMethodId: id }));
    const setPaymentMethod = (id: PaymentMethodId) => setData((prev) => ({ ...prev, paymentMethod: id }));
    async function GetAddress(signal: AbortSignal) {
        try {
            const reqResult = await PostRequest<Address>(
                GetUserOffersEndpoint,
                {},
                OrderNotification,
                signal
            );
            if (!reqResult.isError && reqResult.result !== undefined) {
                setData(prev => ({ ...prev, address: { ...reqResult.result! } }));
            }
        } catch (error) {
            /* empty */
        }
    }
    async function CreateOrder(signal: AbortSignal | undefined = undefined) {
        if (data.address?.id && data.deliveryMethodId && data.offer?.id && data.paymentMethod) {
            const payloady: Order = { addressId: data.address?.id, deliveryMethod: data.deliveryMethodId, OfferId: data.offer?.id, paymentMethod: data.paymentMethod }
            try {
                const reqResult = await PostRequest<Address>(
                    CreateOrderEndpoint,
                    payloady,
                    undefined,
                    signal
                );
                if (!reqResult.isError && reqResult.result !== undefined) {
                    navigate(`/`)
                }
            } catch (error) {
                /* empty */
            }
        }
    }

    async function SubmitOnEnter(
        e: React.KeyboardEvent<HTMLElement>
    ) {
        const { key } = e;
        if (key === "Enter") {
            e.preventDefault();
            return await CreateOrder();
        }
        return false;
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        GetAddress(signal);
        return () => {
            controller.abort();
        };
    }, []);

    return (
        <>
            <Box
                mx="auto"
                px={rem(16)}
                pb={rem(32)}
            >
                <SimpleGrid
                    key={data.offer?.id}
                    style={{ backgroundColor: "white", alignItems: "flex-start", gap: rem(16) }}
                    cols={{ base: 1, md: 2 }}
                >
                    <form
                        style={{ margin: rem(8) }}
                        onKeyDown={async (e: React.KeyboardEvent<HTMLElement>) => {
                            await SubmitOnEnter(e);
                        }}
                    > <Fieldset legend="Checkout" styles={sectionStyles} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                            <Fieldset legend="Confirm your delivery address" styles={sectionStyles}>
                                <TextInput
                                    label="Address details Name"
                                    value={data.address?.name}
                                    readOnly
                                    placeholder="Name"
                                    leftSection={<IconLabel style={inputIconStyle} />}
                                />
                                <TextInput
                                    label="Street"
                                    value={data.address?.street}
                                    readOnly
                                    placeholder="Street"
                                    mt="md"
                                    leftSection={<IconPackages style={inputIconStyle} />}
                                />
                                <TextInput
                                    label="City"
                                    value={data.address?.city}
                                    readOnly
                                    placeholder="City"
                                    mt="md"
                                    leftSection={<IconBuilding style={inputIconStyle} />}
                                />
                                <TextInput
                                    label="Phone"
                                    value={data.address?.phone}
                                    readOnly
                                    placeholder="+48 123 123 123"
                                    mt="md"
                                    leftSection={<IconPhone style={inputIconStyle} />}
                                />
                            </Fieldset>
                            <Fieldset legend="Pick payment method" mt={rem(16)} styles={sectionStyles}>
                                <Radio.Group
                                    value={data.paymentMethod ?? undefined}
                                    onChange={(val) => setPaymentMethod(val as PaymentMethodId)}
                                >
                                    <Stack gap="sm">
                                        {paymentMethods.map((method) => {
                                            const checked = data.paymentMethod === method.id;
                                            const Icon = method.icon;
                                            return (
                                                <Box
                                                    key={method.id}
                                                    component="label"
                                                    p="md"
                                                    className="checkout-card"
                                                    style={checked ? radioStackStylesChecked : radioStackStyles}
                                                >
                                                    <Group justify="space-between" align="center">
                                                        <Group gap="sm">
                                                            <Radio value={method.id} />
                                                            <Group gap="xs">
                                                                <Icon size={18} />
                                                                <Text fw={600}>{method.name}</Text>
                                                            </Group>
                                                        </Group>
                                                    </Group>
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                </Radio.Group>
                            </Fieldset>
                            <Fieldset legend="Choose how you want to receive your order" mt={rem(16)} styles={sectionStyles}>
                                <Radio.Group
                                    value={data.deliveryMethodId ?? undefined}
                                    onChange={(val) => setDeliveryMethod(val as DeliveryMethodId)}
                                >
                                    <Stack gap="sm">
                                        {deliveryMethods.map((method) => {
                                            const checked = data.deliveryMethodId === method.id;
                                            return (
                                                <Box
                                                    key={method.id}
                                                    component="label"
                                                    p="md"
                                                    style={checked ? radioStackStylesChecked : radioStackStyles}
                                                >
                                                    <Group justify="space-between" align="flex-start">
                                                        <Group align="flex-start">
                                                            <Radio value={method.id} mr="sm" styles={{ body: { alignItems: "flex-start" } }} />
                                                            <div>
                                                                <Text fw={600}>{method.name}</Text>
                                                                <Text size="sm" c="dimmed">
                                                                    {method.description}
                                                                </Text>
                                                            </div>
                                                        </Group>
                                                        <Text fw={600}>{method.price.toFixed(2)} zł</Text>
                                                    </Group>
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                </Radio.Group>
                            </Fieldset>
                            <Group pt={rem(16)}>
                                <Btn
                                    title="Buy"
                                    fullWidth
                                    className="checkout-button"
                                    onClick={async () => await CreateOrder()}
                                />
                            </Group>
                        </Fieldset>
                    </form>
                    <Box style={{ position: "sticky", top: rem(16) }} mb={rem(8)} mr={rem(8)}>
                        <Fieldset legend="The item you are purchasing" styles={sectionStyles} mt={rem(8)} mb={rem(8)} mr={rem(8)} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                            <SimpleGrid cols={2} style={{ alignItems: "stretch" }}>
                                <Box ml={rem(4)} style={{ height: "100%" }}>
                                    <Fieldset legend="Item information" style={{ height: "100%", display: "flex", flexDirection: "column", border: "none" }}>
                                        <Text size="lg" fw={600} mb="xs">
                                            {data.offer?.tittle}
                                        </Text>
                                        <Text size="xs" c="dimmed" mb="xs">
                                            Offer added: {data.offer?.creationDate}
                                        </Text>
                                        <Text size="md" fw={600} mb="sm">
                                            Price: {data.offer?.price} zł
                                        </Text>

                                        <Text size="md" fw={800} mb={4}>
                                            Description:
                                        </Text>
                                        <Textarea
                                            value={data.offer?.description}
                                            onFocus={(e) => e.target.blur()}
                                            readOnly
                                            autosize
                                            variant="unstyled"
                                        />
                                    </Fieldset>
                                </Box>
                                <Box>
                                    <Image src={data.offer?.photos[0]} w={'90%'} width={'90%'} />
                                </Box>
                            </SimpleGrid>
                        </Fieldset>
                    </Box>
                </SimpleGrid>
            </Box>
        </>
    )
}

export default CheckoutForm;