import { Group, rem, TextInput } from "@mantine/core";
import Btn from "../../Components/Btn";
import { IconBuilding, IconLabel, IconPackages, IconPhone } from "@tabler/icons-react";
import { Address } from "../../Types/Address";
import { KeyboardEvent, useEffect, useState } from "react";
import { INotyfication } from "../../Types/Notyfication";
import { Api } from "../../Helpers/Api/Api";

const upsertEndpoint = "Address/upsert";

const addNotification: INotyfication = {
  Title: "Add or Update",
  Message: "Proccesing your request.",
  SuccessMessage: "Address was procesed successfully.",
};

type AddressState = {
  Address: Address;
};

const emptyAddress: Address = {
  id: "",
  userId: "",
  name: "",
  city: "",
  country: "PL",
  phone: "",
  street: "",
};

type AdressDetailsProps = {
  address: Address | null;
  onAddressChange: (address: Address) => void;
  onSaved?: (address: Address) => void;
  onDeleted?: (addressId: string) => void; // 👈 tylko id, bez hasła
};

const styles = { width: rem(18), height: rem(18) };

function AdressDetails({ address, onAddressChange, onSaved, onDeleted }: AdressDetailsProps) {
  const { PostRequest } = Api();

  const [data, setData] = useState<AddressState>({
    Address: address ?? emptyAddress,
  });

  useEffect(() => {
    setData({
      Address: address ?? emptyAddress,
    });
  }, [address]);

  const Set = <K extends keyof Address>(key: K, value: Address[K]) => {
    setData((prev) => {
      const updated: Address = { ...prev.Address, [key]: value };
      onAddressChange(updated);
      return { Address: updated };
    });
  };

  const Submit = async () => {
    const result = await PostRequest<Address>(upsertEndpoint, { ...data.Address }, addNotification);
    if (!result.isError && result.result) {
      const saved = result.result;
      setData({ Address: { ...saved } });
      onAddressChange(saved);
      onSaved?.(saved);
    }
  };

  async function SubmitOnEnter(e: KeyboardEvent<HTMLElement>) {
    const { key } = e;
    if (key === "Enter") {
      e.preventDefault();
      await Submit();
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

  const Delete = () => {
    if (!data.Address.id) return; 
    onDeleted?.(data.Address.id);
  };

  return (
    <form
      onKeyDown={async (e: KeyboardEvent<HTMLElement>) => {
        await SubmitOnEnter(e);
      }}
    >
      <TextInput
        label="Address details Name"
        value={data.Address.name}
        onChange={(e) => Set("name", e.target.value)}
        placeholder="Name"
        leftSection={<IconLabel style={styles} />}
      />
      <TextInput
        label="Street"
        value={data.Address.street}
        onChange={(e) => Set("street", e.target.value)}
        placeholder="Street"
        mt="md"
        leftSection={<IconPackages style={styles} />}
      />
      <TextInput
        label="City"
        value={data.Address.city}
        onChange={(e) => Set("city", e.target.value)}
        placeholder="City"
        mt="md"
        leftSection={<IconBuilding style={styles} />}
      />
      <TextInput
        label="Phone"
        value={data.Address.phone}
        onChange={(e) => Set("phone", formatPhone(e.target.value))}
        placeholder="+48 123 123 123"
        mt="md"
        leftSection={<IconPhone style={styles} />}
      />

      <Group justify="end" mt="md">
        <Btn
          title="Delete"
          onClick={Delete}
          disabled={!data.Address.id}
        />
        <Btn
          title="Submit"
          onClick={Submit}
        />
      </Group>
    </form>
  );
}

export default AdressDetails;
