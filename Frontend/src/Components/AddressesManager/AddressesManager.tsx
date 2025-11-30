import { Divider, Fieldset, Select } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { Address } from "../../Types/Address";
import AdressDetails from "../../Form/AdressDetails/AdressDetails";
import { IconMapPin } from "@tabler/icons-react";
import { INotyfication } from "../../Types/Notyfication";

const getAllEndpoint = "Address/get";
const NEW_ADDRESS_VALUE = "__new";

const deleteEndpoint = "Address/delete";
const deleteNotification: INotyfication = {
  Title: "Delete address",
  Message: "Deleting address...",
  SuccessMessage: "Address deleted successfully.",
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

function AddressesManager() {
  const { PostRequest } = Api();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      const result = await PostRequest<Address[]>(getAllEndpoint, {}, undefined, signal);
      if (!result.isError && result.result) {
        const list = result.result;
        setAddresses(list);

        if (list.length > 0) {
          setSelectedId(list[0].id);
          setCurrentAddress(list[0]);
        } else {
          setSelectedId(NEW_ADDRESS_VALUE);
          setCurrentAddress(emptyAddress);
        }
      }
    })();

    return () => controller.abort();
  }, []);

  const handleSelectChange = (value: string | null) => {
    if (!value) return;

    setSelectedId(value);

    if (value === NEW_ADDRESS_VALUE) {
      setCurrentAddress(emptyAddress);
      return;
    }

    const found = addresses.find((a) => a.id === value);
    setCurrentAddress(found ?? null);
  };

  const handleAddressChange = (addr: Address) => {
    setCurrentAddress(addr);
    if (addr.id) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === addr.id ? addr : a))
      );
    }
  };

  const handleSaved = (saved: Address) => {
    setAddresses((prev) => {
      const exists = prev.some((a) => a.id === saved.id);
      if (exists) {
        return prev.map((a) => (a.id === saved.id ? saved : a));
      }
      return [...prev, saved];
    });

    setSelectedId(saved.id);
    setCurrentAddress(saved);
  };

  const selectData = [
    ...addresses.map((a) => ({
      value: a.id,
      label: a.name || `${a.city} ${a.street}` || "(No name)",
    })),
    { value: NEW_ADDRESS_VALUE, label: "➕ New address" },
  ];

  const handleDeletedInState = (id: string) => {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);

      if (next.length === 0) {
        setSelectedId(NEW_ADDRESS_VALUE);
        setCurrentAddress(emptyAddress);
      } else {
        const first = next[0];
        setSelectedId(first.id);
        setCurrentAddress(first);
      }

      return next;
    });
  };

  const handleDeleteRequested = (id: string) => {
    const addr = addresses.find((a) => a.id === id);

    modals.openConfirmModal({
      title: "Delete address",
      children: `Are you sure you want to delete address "${addr?.name || `${addr?.city ?? ""} ${addr?.street ?? ""}`.trim() || id}"?`,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "var(--main-color)" },
      onConfirm: async () => {
        const result = await PostRequest<boolean>(
          deleteEndpoint,
          { id },
          deleteNotification
        );

        if (!result.isError) {
          handleDeletedInState(id);
        }
      },
    });
  };

  return (
    <Fieldset legend="Address details" style={{ textAlign: "start" }}>
      <Select
        label="Choose address"
        data={selectData}
        value={selectedId}
        onChange={handleSelectChange}
        mb="md"
        leftSection={<IconMapPin size={16} />}
      />

      <Divider my="sm" label="Edit selected address" labelPosition="center" />

      <AdressDetails
        address={currentAddress}
        onAddressChange={handleAddressChange}
        onSaved={handleSaved}
        onDeleted={handleDeleteRequested}
      />
    </Fieldset>
  );
}

export default AddressesManager;
