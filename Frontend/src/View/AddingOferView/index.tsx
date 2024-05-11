import {
  Container,
  SimpleGrid,
  Space,
  TextInput,
  Group,
  Text,
  rem,
  Textarea,
} from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import MainPanel from "../../Components/MainPanel";
import { useState } from "react";
import ImageOfferAdding from "../../Components/ImageOfferAdding";

function AddingOferView() {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const previews = files.map((file, index) => {
    return (
      <>
        <ImageOfferAdding
          imageUrl={URL.createObjectURL(file)}
          index={index}
          removePhoto={removePhoto}
        />
      </>
    );
  });

  function removePhoto(index: number) {
    setFiles([...files.slice(0, index), ...files.slice(index + 1)]);
  }

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
          required
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
        <Textarea
          className="text-start"
          label="Input label"
          placeholder="Input placeholder"
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
        />
        <Space h="md" />
      </Container>
    </MainPanel>
  );
}
export default AddingOferView;
