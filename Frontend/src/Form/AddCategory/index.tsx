import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  TextInput,
  rem,
} from "@mantine/core";
import { UseAddingCategory } from "./UseAddingCategory";
import Categories from "../../Components/Categories";
import CategoryTimeline from "../../Components/CategoryTimeline";

function AddCategoryForm() {
  const {
    handleAddCategory,
    AddCategoryOnEnter,
    setNewCategoryName,
    AddNewParentCategory,
    setNewParentId,
    handleDeleteCategory,
    categories,
    newCategory,
    parentId,
    parentCategory
  } = UseAddingCategory();

  

  return (
    <>
      <Box p={rem(20)}>
        <CategoryTimeline parentCategory={parentCategory} setNewParentId={setNewParentId} />
      </Box>
      <SimpleGrid cols={3}>
        <Categories categories={categories} parentId={parentId} AddNewParentCategory={AddNewParentCategory} handleDeleteCategory={handleDeleteCategory} />
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
            <Button onClick={handleAddCategory}>Add</Button>
          </Flex>
        </Box>
      </SimpleGrid>
    </>
  );
}

export default AddCategoryForm;
