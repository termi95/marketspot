import { Box, Flex, SimpleGrid, rem } from "@mantine/core";
import Categories from "../../Components/Categories";
import CategoryTimeline from "../../Components/CategoryTimeline";
import CustomLoader from "../../Components/Loader";
import { UseGetingCategory } from "./UseGetingCategory";
import { closeAllModal } from "../../Components/Modal";
import { ICategory } from "../../Types/Category";
import Btn from "../../Components/Btn";
interface Props {
  GetCategory: (category: ICategory) => void;
}
function GetCategoryForm({GetCategory}:Props) {
  const {
    AddNewParentCategory,
    setNewParentId,
    getChosenCategory,
    categories,
    parentId,
    parentCategory,
    loading
  } = UseGetingCategory();

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
          activeTrashIcon={false}
          AddNewParentCategory={AddNewParentCategory}          
        />
        <Box>
          <Flex
            gap="xs"
            justify="center"
            align="flex-end"
            direction="row"
            wrap="wrap"
            w={"100%"}
          >
          </Flex>
        </Box>
      </SimpleGrid>
      <Btn 
        title="Chose category" 
        fullWidth
        onClick={()=>{
            closeAllModal();
            GetCategory(getChosenCategory());
          }}
        />
    </>
  );
}

export default GetCategoryForm;
