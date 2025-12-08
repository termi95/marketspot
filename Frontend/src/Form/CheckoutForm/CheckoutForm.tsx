import { Box, Divider, Fieldset, Group, Image, Radio, rem, Select, SimpleGrid, Stack, Text, Textarea, TextInput } from "@mantine/core";
import Btn from "../../Components/Btn";
import { useEffect, useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { CheckoutOffer, DeliveryMethod, DeliveryMethodId } from "../../Types/Offer";
import { Address } from "../../Types/Address";
import { IconBarcode, IconBrandPaypal, IconBuilding, IconBuildingBank, IconCash, IconCreditCard, IconLabel, IconMapPin, IconPackages, IconPhone } from "@tabler/icons-react";
import { Order } from "../../Types/Order";
import { useNavigate } from "react-router-dom";
import { INotyfication } from "../../Types/Notyfication";
import DOMPurify from "dompurify";

interface Props {
    offer: CheckoutOffer;
}

type CheckoutState = {
    offer: CheckoutOffer | undefined;
    addresses: Address[];
    address: Address | null;
    selectedAddressId: string;
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
    addresses: [],
    selectedAddressId: "",
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
            const reqResult = await PostRequest<Address[]>(
                GetUserOffersEndpoint,
                {},
                undefined,
                signal
            );
            if (!reqResult.isError && reqResult.result !== undefined) {
                const hasData = reqResult.result!.length > 1;
                setData(prev => (
                    {
                        ...prev,
                        addresses: [...reqResult.result!],
                        address: hasData ? reqResult.result![0] : initState.address,
                        selectedAddressId: hasData ? reqResult.result![0].id : initState.selectedAddressId,
                    }
                ));
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
                    OrderNotification,
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
    const handleSelectChange = (value: string | null) => {
        if (!value) return;

        setData(prev => ({ ...prev, selectedAddressId: value }));

        const found = data.addresses.find((a) => a.id === value);
        setData(prev => ({ ...prev, address: (found ?? initState.address) }));;
    };

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

    const selectData = [
        ...data.addresses.map((a) => ({
            value: a.id,
            label: a.name || `${a.city} ${a.street}` || "(No name)",
        })),
    ];

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

                            <Select
                                label="Choose address"
                                data={selectData}
                                value={data.selectedAddressId}
                                onChange={handleSelectChange}
                                mb="md"
                                pl={20}
                                pr={20}
                                leftSection={<IconMapPin size={16} style={inputIconStyle} />}
                            />
                            <Divider my="sm" label="Your delivery address" labelPosition="center" />
                            <Fieldset styles={sectionStyles}>
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
                                        <Box
                                            style={{
                                                lineHeight: 1.6,
                                                maxWidth: "100%",
                                                textAlign: "justify",
                                                fontSize: "16px",
                                            }}
                                            dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(offer.description),
                                            }}
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