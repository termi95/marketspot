import { ActionIcon, Box, Button, Container, Fieldset, Group, Image, NumberInput, Radio, rem, SimpleGrid, Space, Stack, Text, Textarea, TextInput } from "@mantine/core";
import Btn from "../../Components/Btn";
import { IconBuilding, IconPackage, IconPackages, IconPhone, IconPhoto, IconSparkles, IconTruck, IconUpload, IconWalk, IconX } from "@tabler/icons-react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import UseAddingOferView from "./UseAddingOferView";
import { openDeleteModal } from "../../Components/Modal";
import GetCategoryForm from "../GetCategory";
import CustomLoader from "../../Components/Loader";
import { ICategory } from "../../Types/Category";
import { Condytion, DeliveryType } from "../../Types/Offer";

interface Props {
  id?: string | undefined | null;
}

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

const sectionStyles = {
  legend: {
    fontSize: rem(16),
  },
  root: {
    textAlign: "start",
    border: "none"
  },
} as const;
const inputIconStyle = { width: rem(18), height: rem(18) };

function AddOrUpdateOfferForm({ id }: Props) {
  const {
    setFiles,
    submit,
    IsNullOrEmpty,
    setData,
    handleDragEnd,
    handleDragEnter,
    handleDragStart,
    handleRemove,
    mainCategoryId,
    data,
    photos,
    files,
    useExistingPhotos,
    draggedIndex
  } = UseAddingOferView({ id });
  const { loading, title, price, category, deliveryType, description, condytion, pickupAddress } = data;
  function setCategory(value: ICategory) {
    setData(prev => ({ ...prev, category: value }));
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

  // to do check use-debounced-value aby sprawdzic czy poprawi to wydajnosc !opcjonalne!
  if (loading) {
    return <CustomLoader setBg={false} />;
  }
  return (
    <Container bg={"#f8f9fa"}>
      <Space h="md" />
      <TextInput
        className="text-start"
        label="Title"
        placeholder="It is important to put meaning full title to your offer"
        value={title}
        onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
      />
      <Space h="md" />
      <Box>
        <NumberInput
          className="text-start"
          label="Price"
          placeholder="How much would you like to receive"
          min={0}
          suffix=" PLN"
          value={price}
          onChange={(value) => setData(prev => ({ ...prev, price: value }))}
        />
      </Box>
      <Space h="md" />
      <Button
        color={"var(--main-color)"}
        variant={"outline"}
        w={"100%"}
        style={{
          transition: "300ms",
          height: rem(42),
        }}
        onClick={() => openDeleteModal(() => { return }, "Category picker", "", <GetCategoryForm GetCategory={setCategory} />, false)}
      >
        Chose your category
      </Button>
      <Space h="md" />
      <Box>
        <Text>Selected category:</Text>
        <Text size="xl" fw={700}>{mainCategoryId !== category.id && category.name}</Text>
      </Box>
      <Space h="md" />
      <Textarea
        className="text-start"
        label="Description"
        placeholder="You offer description"
        value={description}
        autosize
        onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
      />
      <Space h="md" />

      <Fieldset legend="Select item condition" styles={sectionStyles}>
        <Radio.Group
          value={condytion === Condytion.New ? "New" : "Used"}
          onChange={(val) => setData(prev => ({ ...prev, condytion: val === "New" ? Condytion.New : Condytion.Used }))}
        >
          <Stack gap="sm">
            {["New", "Used"].map((item) => {
              const Icon = item === "New" ? IconSparkles : IconPackage;
              const Checked = item === condytion;
              return (
                <Box
                  key={item}
                  component="label"
                  p="md"
                  className="checkout-card"
                  style={Checked ? radioStackStylesChecked : radioStackStyles}
                >
                  <Group justify="space-between" align="center">
                    <Group gap="sm">
                      <Radio value={item} />
                      <Group gap="xs">
                        <Icon size={18} />
                        <Text fw={600}>{item}</Text>
                      </Group>
                    </Group>
                  </Group>
                </Box>
              );
            })}
          </Stack>
        </Radio.Group>
      </Fieldset>
      <Space h="md" />

      <Fieldset legend="Select will you send item" styles={sectionStyles}>
        <Radio.Group
          value={deliveryType}
          onChange={(val) => setData(prev => ({ ...prev, deliveryType: val === "Shipping" ? DeliveryType.Shipping : DeliveryType.LocalPickup }))}
        >
          <Stack gap="sm">
            {["Shipping", "LocalPickup"].map((item) => {
              const Icon = item === "Shipping" ? IconTruck : IconWalk;
              const Checked = item === deliveryType
              return (
                <Box
                  key={item}
                  component="label"
                  p="md"
                  className="checkout-card"
                  style={Checked ? radioStackStylesChecked : radioStackStyles}
                >
                  <Group justify="space-between" align="center">
                    <Group gap="sm">
                      <Radio value={item} />
                      <Group gap="xs">
                        <Icon size={18} />
                        <Text fw={600}>{item}</Text>
                      </Group>
                    </Group>
                  </Group>
                </Box>
              );
            })}
          </Stack>
        </Radio.Group>
      </Fieldset>
      {deliveryType === DeliveryType.LocalPickup &&
        <Fieldset legend="Pickup address" styles={sectionStyles}>
          <TextInput
            label="Street"
            value={pickupAddress.street}
            onChange={(e) => setData(prev => ({ ...prev, pickupAddress: { ...prev.pickupAddress, street: e.target.value } }))}
            placeholder="Street"
            mt="md"
            leftSection={<IconPackages style={inputIconStyle} />}
          />
          <TextInput
            label="City"
            value={pickupAddress.city}
            onChange={(e) => setData(prev => ({ ...prev, pickupAddress: { ...prev.pickupAddress, city: e.target.value } }))}
            placeholder="City"
            mt="md"
            leftSection={<IconBuilding style={inputIconStyle} />}
          />
          <TextInput
            label="Contact telephone"
            value={pickupAddress.phone}
            onChange={(e) => setData(prev => ({ ...prev, pickupAddress: { ...prev.pickupAddress, phone: formatPhone(e.target.value) } }))}
            placeholder="+48 123 123 123"
            mt="md"
            leftSection={<IconPhone style={inputIconStyle} />}
          />
        </Fieldset>
      }
      <Space h="md" />

      <Dropzone
        onDrop={(newFiles) => {
          setFiles((prev) => {
            const merged = [...prev, ...newFiles];
            if (merged.length > 9) {
              return merged.slice(0, 9);
            }
            return merged;
          });
        }}
        onReject={() => { }}
        maxSize={5 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
      >
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <IconUpload
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-blue-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-red-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-dimmed)",
              }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach max 9 photos, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone>
      <Space h="md" /><SimpleGrid
        cols={{ base: 1, sm: 4 }}
        mt={(useExistingPhotos ? photos.length : files.length) > 0 ? "xl" : 0}
      >
        {(useExistingPhotos ? photos : files).map((item, index) => {
          const src = useExistingPhotos
            ? (item as string)
            : URL.createObjectURL(item as File);

          return (
            <Box
              key={useExistingPhotos ? src : `${(item as File).name}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={(e) => {
                e.preventDefault();
                handleDragEnter(index);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={handleDragEnd}
              style={{
                cursor: "grab",
                opacity: draggedIndex === index ? 0.7 : 1,
              }}
            >
              <Box pos="relative">
                <Image
                  src={src}
                  radius="md"
                  mah={200}
                  fit="cover"
                  alt="Offer image"
                  style={{ cursor: "pointer" }}
                />
                <ActionIcon
                  variant="filled"
                  radius="xl"
                  size="sm"
                  color="red"
                  style={{ position: "absolute", top: 8, right: 8 }}
                  onClick={() => handleRemove(index)}
                >
                  <IconX size={14} />
                </ActionIcon>
              </Box>
            </Box>
          );
        })}
      </SimpleGrid>

      <Space h="md" />
      <Btn title={IsNullOrEmpty(id) ? "Add" : "Update"} onClick={submit} fullWidth />
      <Space h="md" />
    </Container>
    )
}

export default AddOrUpdateOfferForm