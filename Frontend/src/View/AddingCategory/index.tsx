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
  const {AddCategory,AddCategoryOnEnter, setNewCategoryName, categories, newCategory, parentId}= UseAddingCategory();
  function GetCategoryByParentId(parentId: string) {
    return categories
      .filter((x) => x.parentId === parentId)
      .map((x) => {
        console.log(x.parentId);
        return ( 
          <Box
            key={x.id}
            ml={rem(10)}
            mr={rem(10)}
            p={rem(10)}
            bg={"white"}
            style={{
              border:
                "calc(.0625rem*var(--mantine-scale)) solid var(--_input-bd)",
              borderRadius: "var(--_input-radius)",
            }}
          >
            {x.name}
          </Box>);
      });
  }
  const categoryGrid = GetCategoryByParentId(parentId);

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
            <TextInput value={newCategory.name} onChange={(event) => setNewCategoryName(event.currentTarget.value)} placeholder="Category name" w={"60%"} />
            <Button onClick={() => AddCategory({...newCategory})}>Add</Button>
          </Flex>
        </Box>
      </SimpleGrid>
    </MainPanel>
  );
}

export default AddingCategory;
