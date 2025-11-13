import { Fieldset, Group, rem, TextInput } from "@mantine/core";
import Btn from "../../Components/Btn";
import { IconBuilding, IconLabel, IconPackages, IconPhone } from "@tabler/icons-react";
import { Address } from "../../Types/Address";
import { useEffect, useState } from "react";
import { INotyfication } from "../../Types/Notyfication";
import { Api } from "../../Helpers/Api/Api";


const upsertEndpoint = "Address/upsert";
const getEndpoint = "Address/get";
const addNotification: INotyfication = {
    Title: "Add or Update",
    Message: "Proccesing your request.",
    SuccessMessage: "Address was procesed successfully.",
};

type AddressState = {
    Address: Address;
};

const defaultState: AddressState = {
    Address: {
        id: "",
        userId: "",
        name: "",
        city: "",
        country: 'PL',
        phone: "",
        street: "",
    }
}
function AdressDetails() {
    const { PostRequest } = Api();
    const [data, setData] = useState<AddressState>(defaultState);
    const Set = <K extends keyof Address>(key: K, value: Address[K]) => setData(prev => ({ ...prev, Address: { ...prev.Address, [key]: value } }));

    const Submit = async () => {
        const result = await PostRequest<Address>(upsertEndpoint, { ...data.Address }, addNotification);
        if (!result.isError && result.result !== undefined && result.result !== null) {
            setData((prev) => ({ ...prev, Address: { ...result.result! } }));
        }
    };

    async function SubmitOnEnter(e: React.KeyboardEvent<HTMLElement>) {
        const { key } = e;
        if (key === "Enter") {
            e.preventDefault();
            await Submit();
        }
    }

    const getAddress = async (signal: AbortSignal) => {
        const result = await PostRequest<Address>(getEndpoint, {}, undefined, signal);
        if (!result.isError && result.result !== undefined && result.result !== null) {
            setData((prev) => ({ ...prev, Address: { ...result.result! } }));
        }
    }

    function formatPhone(input: string) {
        const digits = input.replace(/\D/g, "");

        if (digits.length === 0) return "";

        let normalized = digits.startsWith("48") ? digits.slice(2) : digits;

        normalized = normalized.slice(0, 9);

        const part1 = normalized.slice(0, 3);
        const part2 = normalized.slice(3, 6);
        const part3 = normalized.slice(6, 9);

        const formatted = [part1, part2, part3].filter(Boolean).join(" ");

        return `+48 ${formatted}`.trim();
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        getAddress(signal);
        return () => {
            controller.abort();
        };
    }, [])

    return (
        <form
            onKeyDown={async (e: React.KeyboardEvent<HTMLElement>) => {
                await SubmitOnEnter(e);
            }}
        >
            <Fieldset legend="Address details" style={{ textAlign: "start" }}>
                <TextInput
                    label="Address details Name"
                    value={data.Address.name}
                    onChange={(e) => Set("name", e.target.value)}
                    placeholder="Name"
                    leftSection={<IconLabel style={{ width: rem(18), height: rem(18) }} />}
                />
                <TextInput
                    label="Street"
                    value={data.Address.street}
                    onChange={(e) => Set("street", e.target.value)}
                    placeholder="Street"
                    mt="md"
                    leftSection={<IconPackages style={{ width: rem(18), height: rem(18) }} />}
                />
                <TextInput
                    label="City"
                    value={data.Address.city}
                    onChange={(e) => Set("city", e.target.value)}
                    placeholder="City"
                    mt="md"
                    leftSection={<IconBuilding style={{ width: rem(18), height: rem(18) }} />}
                />
                <TextInput
                    label="Phone"
                    value={data.Address.phone}
                    onChange={(e) => Set("phone", formatPhone(e.target.value))}
                    placeholder="+48 123 123 123"
                    mt="md"
                    leftSection={<IconPhone style={{ width: rem(18), height: rem(18) }} />}
                />

                <Group justify="flex-end" mt="md">
                    <Btn
                        title="Submit"
                        onClick={Submit}
                    />
                </Group>
            </Fieldset>
        </form>
    );
}
export default AdressDetails;
