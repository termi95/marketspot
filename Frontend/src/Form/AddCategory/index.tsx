import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  TextInput,
  Timeline,
  rem,
} from "@mantine/core";
import { UseAddingCategory } from "./UseAddingCategory";
import Categories from "../../Components/Categories";

function AddCategoryForm() {
  const {
    AddCategory,
    AddCategoryOnEnter,
    setNewCategoryName,
    categories,
    newCategory,
    parentId,
    mainCategoryId
  } = UseAddingCategory();

  return (
    <>
      <Box p={rem(20)} key={mainCategoryId}>
        <Timeline active={1}>
          <Timeline.Item title="Main category"></Timeline.Item>
        </Timeline>
      </Box>
      <SimpleGrid cols={3}>
        <Categories categories={categories} parentId={parentId} />
        <Box>
          <Flex
            gap="xs"
            justify="center"
            align="flex-end"
            direction="row"
            wrap="wrap"
            w={"100%"}
            onKeyDown={async (e: React.KeyboardEvent<HTMLElement>) => {
              await AddCategoryOnEnter({ ...newCategory }, e);
            }}
          >
            <TextInput
              value={newCategory.name}
              onChange={(event) =>
                setNewCategoryName(event.currentTarget.value)
              }
              placeholder="Category name"
              w={"60%"}
            />
            <Button onClick={() => AddCategory({ ...newCategory })}>Add</Button>
          </Flex>
        </Box>
      </SimpleGrid>
    </>
  );
}

export default AddCategoryForm;
