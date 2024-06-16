import {
  Container,
  SimpleGrid,
  Space,
  TextInput,
  Group,
  Text,
  rem,
  Textarea,
  Box,
  Button,
  NumberInput,
} from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import MainPanel from "../../Components/MainPanel";
import ImageOfferAdding from "../../Components/ImageOfferAdding";
import UseAddingOferView from "./UseAddingOferView";
import { openDeleteModal } from "../../Components/Modal";
import GetCategoryForm from "../../Form/GetCategory";

function AddingOferView() {
  const {
    setFiles,
    setDescription,
    setCategory,
    setTitle,
    removePhoto,
    setPrice,
    submit,
    files,
    title,
    category,
    description,
    hovered,
    ref,
    mainCategoryId,
    price
  } = UseAddingOferView();

  const previews = files.map((file, index) => {
    return (
      <ImageOfferAdding
        key={file.name}
        imageUrl={URL.createObjectURL(file)}
        index={index}
        fileName={file.name}
        removePhoto={removePhoto}
      />
    );
  });

  return (
    <MainPanel>
      <Space h="md" />
      <Container bg={"#f8f9fa"}>
        <Space h="md" />
        <TextInput
          className="text-start"
          label="Title"
          placeholder="It is important to put meaning full title to your offer"
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
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
          onChange={setPrice}
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
          onClick={() => openDeleteModal(()=>{return}, "Category picker", "", <GetCategoryForm GetCategory={setCategory}/>, false)}
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
          onChange={(event) => setDescription(event.currentTarget.value)}
        />
        <Space h="md" />
        <Dropzone
          onDrop={(files) => {
            if (files.length <= 9) {
              setFiles(files);
            } else {
              //add info for user that he add to many photo
            }
          }}
          onReject={(files) => console.log("rejected files", files)}
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
        <Space h="md" />
        <SimpleGrid
          cols={{ base: 1, sm: 4 }}
          mt={previews.length > 0 ? "xl" : 0}
        >
          {previews}
        </SimpleGrid>
        <Space h="md" />
        <Button
          w={"100%"}
          color={"var(--main-color)"}
          variant={hovered ? "outline" : "filled"}
          ref={ref}          
          style={{
            transition: "300ms",
            height: rem(42),
          }}
          onClick={submit}
        >
          Add offer
        </Button>
        <Space h="md" />
      </Container>
    </MainPanel>
  );
}
export default AddingOferView;
