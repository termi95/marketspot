import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  TextInput,
  Timeline,
  rem,
} from "@mantine/core";
import MainPanel from "../../Components/MainPanel";
import { UseAddingCategory } from "./UseAddingCategory";

function AddingCategory() {
  const {AddCategory,AddCategoryOnEnter, setNewCategory, categories, newCategory}= UseAddingCategory();
  function GetCategoryByParentId(parentId: string) {
    return categories
      .filter((x) => x.ParentUid === parentId)
      .map((x) => {
        return [
          <Box
            key={x.Uid}
            ml={rem(10)}
            p={rem(10)}
            bg={"white"}
            style={{
              border:
                "calc(.0625rem*var(--mantine-scale)) solid var(--_input-bd)",
              borderRadius: "var(--_input-radius)",
            }}
          >
            {x.Name}
          </Box>,
        ];
      });
  }
  const categoryGrid = GetCategoryByParentId("test");

  return (
    <MainPanel>
      <Box p={rem(20)}>
        <Timeline active={1}>
          <Timeline.Item title="Main category"></Timeline.Item>
        </Timeline>
      </Box>
      <SimpleGrid cols={3}>
        {categoryGrid}
        <Box>
          <Flex
            gap="xs"
            justify="center"
            align="flex-end"
            direction="row"
            wrap="wrap"
            w={"100%"}
            onKeyDown={async (e: React.KeyboardEvent<HTMLElement>) => {
              await AddCategoryOnEnter({ ...newCategory }, e)
            }}
          >
            <TextInput value={newCategory.Name} onChange={(event) => setNewCategory((prev) => ({ ...prev, Name:event.currentTarget.value }))} placeholder="Category name" w={"60%"} />
            <Button onClick={() => AddCategory({...newCategory})}>Add</Button>
          </Flex>
        </Box>
      </SimpleGrid>
    </MainPanel>
  );
}

export default AddingCategory;
