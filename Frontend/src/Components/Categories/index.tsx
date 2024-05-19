import { Box, rem } from "@mantine/core";
import { ICategory, IDeleteCategory } from "../../Types/Category";
import CornerIcon from "../CornerIcon";
import { useMemo } from "react";

interface Props {
  categories: ICategory[];
  parentId: string;
  AddNewParentCategory: (value: ICategory)=> void;
  handleDeleteCategory: (value: IDeleteCategory) => void;
}
function Categories({ categories, parentId, AddNewParentCategory, handleDeleteCategory}: Props) {
  const categoryList = useMemo(() => {
    function GetCategoryByParentId(parentId: string) {
      return categories
        .filter((x) => x.parentId === parentId)
        .map((x) => {
          return (
            <Box ml={rem(10)} mr={rem(10)} key={x.id}>
              <CornerIcon Action={()=>handleDeleteCategory( {id:x.id} as IDeleteCategory)} value={x.id}>
                <Box
                className="pointer"
                  p={rem(10)}
                  bg={"white"}
                  style={{
                    border:
                      "calc(.0625rem*var(--mantine-scale)) solid var(--_input-bd)",
                    borderRadius: "var(--_input-radius)",
                  }}
                  onClick={()=>AddNewParentCategory(x)}
                >
                  {x.name}
                </Box>
              </CornerIcon>
            </Box>
          );
        });
    }
    return GetCategoryByParentId(parentId);
  }, [AddNewParentCategory, categories, parentId]);

  return <>{categoryList}</>;
}

export default Categories;
