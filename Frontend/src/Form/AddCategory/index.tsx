import { Box, Grid, SimpleGrid, TextInput, rem } from "@mantine/core";
import { UseAddingCategory } from "./UseAddingCategory";
import Categories from "../../Components/Categories";
import CategoryTimeline from "../../Components/CategoryTimeline";
import CustomLoader from "../../Components/Loader";
import Btn from "../../Components/Btn";

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
    parentCategory,
    loading,
  } = UseAddingCategory();

  if (loading) {
    return <CustomLoader setBg={false} />;
  }

  return (
    <>
      <Box p={rem(20)}>
        <CategoryTimeline
          parentCategory={parentCategory}
          setNewParentId={setNewParentId}
        />
      </Box>
      <SimpleGrid cols={3}>
        <Categories
          categories={categories}
          parentId={parentId}
          activeTrashIcon={true}
          AddNewParentCategory={AddNewParentCategory}
          handleDeleteCategory={handleDeleteCategory}
        />
        <Box
          p={rem(10)}
          onKeyDown={async (e: React.KeyboardEvent<HTMLElement>) => {
            await AddCategoryOnEnter({ ...newCategory }, e);
          }}
        >
          <Grid grow gutter="xs">
            <Grid.Col span={6}>
              <TextInput
                value={newCategory.name}
                onChange={(event) =>
                  setNewCategoryName(event.currentTarget.value)
                }
                placeholder="Category name"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Btn title="Add" onClick={handleAddCategory} fullWidth />
            </Grid.Col>
          </Grid>
        </Box>
      </SimpleGrid>
    </>
  );
}

export default AddCategoryForm;
