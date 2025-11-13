import { Box, Fieldset, Group, Image, Radio, rem, SimpleGrid, Stack, Text, Textarea, TextInput } from "@mantine/core";
import Btn from "../../Components/Btn";
import { useEffect, useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { CheckoutOffer } from "../../Types/Offer";
import { Address } from "../../Types/Address";
import { IconBuilding, IconLabel, IconPackages, IconPhone } from "@tabler/icons-react";

interface Props {
    offer: CheckoutOffer;
}

type CheckoutState = {
    offer: CheckoutOffer | undefined
    address: Address | undefined
    deliveryMethodId: DeliveryMethodId | null
}


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
    deliveryMethodId: "inpost"
}

type DeliveryMethodId = "dpd" | "inpost" | "poczta" | "orlen";
type DeliveryMethod = {
    id: DeliveryMethodId;
    name: string;
    description: string;
    price: number;
};
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
const GetUserOffersEndpoint = "Address/get";

function CheckoutForm({ offer }: Props) {
    const { PostRequest } = Api();
    const [data, setData] = useState<CheckoutState>({ ...initState, offer });
    const setDeliveryMethod = (id: DeliveryMethodId) => setData((prev) => ({ ...prev, deliveryMethodId: id }));
    async function GetAddress(signal: AbortSignal) {
        try {
            const reqResult = await PostRequest<Address>(
                GetUserOffersEndpoint,
                {},
                undefined,
                signal
            );
            if (!reqResult.isError && reqResult.result !== undefined) {
                setData(prev => ({ ...prev, address: { ...reqResult.result! } }));
            }
        } catch (error) {
            /* empty */
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        GetAddress(signal);
        return () => {
            controller.abort();
        };
    }, []);

    return (<>
        <SimpleGrid
            key={data.offer?.id}
            style={{ backgroundColor: "white" }}
            cols={2}
            mt={rem(16)}
        >
            <form
                style={{ margin: rem(8) }}
            // onKeyDown={async (e: React.KeyboardEvent<HTMLElement>) => {
            //     await SubmitOnEnter(e);
            // }}
            > <Fieldset legend="Checkout" mt={rem(16)} style={{ textAlign: "start" }}>
                    <Fieldset legend="Address details" style={{ textAlign: "start", height: '100%' }}>
                        <TextInput
                            label="Address details Name"
                            value={data.address?.name}
                            readOnly
                            placeholder="Name"
                            leftSection={<IconLabel style={{ width: rem(18), height: rem(18) }} />}
                        />
                        <TextInput
                            label="Street"
                            value={data.address?.street}
                            readOnly
                            placeholder="Street"
                            mt="md"
                            leftSection={<IconPackages style={{ width: rem(18), height: rem(18) }} />}
                        />
                        <TextInput
                            label="City"
                            value={data.address?.city}
                            readOnly
                            placeholder="City"
                            mt="md"
                            leftSection={<IconBuilding style={{ width: rem(18), height: rem(18) }} />}
                        />
                        <TextInput
                            label="Phone"
                            value={data.address?.phone}
                            readOnly
                            placeholder="+48 123 123 123"
                            mt="md"
                            leftSection={<IconPhone style={{ width: rem(18), height: rem(18) }} />}
                        />
                    </Fieldset>
                    <Fieldset legend="Metoda dostawy" mt={rem(16)} style={{ textAlign: "start" }}>
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
                                            style={{
                                                cursor: "pointer",
                                                borderRadius: rem(8),
                                                border: checked
                                                    ? "1px solid var(--mantine-color-blue-5)"
                                                    : "1px solid var(--mantine-color-gray-3)",
                                                boxShadow: checked
                                                    ? "0 0 0 1px var(--mantine-color-blue-1)"
                                                    : "none",
                                                backgroundColor: checked
                                                    ? "var(--mantine-color-blue-0)"
                                                    : "white",
                                            }}
                                        >
                                            <Group justify="space-between" align="flex-start">
                                                <Group align="flex-start">
                                                    <Radio
                                                        value={method.id}
                                                        mr="sm"
                                                        styles={{ body: { alignItems: "flex-start" } }}
                                                    />
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
                    <Group justify="flex-end" pt={rem(8)}>
                        <Btn
                            title="Submit"
                        // onClick={Submit}
                        />
                    </Group>
                </Fieldset>
            </form>
            <Fieldset legend="The item you are purchasing" style={{ textAlign: "start" }} mt={rem(8)} mb={rem(8)} mr={rem(8)}>
                <SimpleGrid cols={2} style={{ alignItems: "stretch" }}>
                    <Box ml={rem(4)} style={{ height: "100%" }}>
                        <Fieldset legend="Item information" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <Text size="xl">Titlle: {data.offer?.tittle}</Text>
                            <Text size="xs">Offer added: Item {data.offer?.creationDate}</Text>
                            <Text size="md">Price: {data.offer?.price} zł</Text>
                            <Textarea value={data.offer?.description} onFocus={(e) => e.target.blur()} readOnly label="Description:" autosize variant="unstyled" />
                        </Fieldset>
                    </Box>
                    <Box>
                        <Image src={data.offer?.photos[0]} w={'90%'} width={'90%'} />
                    </Box>
                </SimpleGrid>
            </Fieldset>
        </SimpleGrid>
    </>
    )
}

export default CheckoutForm;