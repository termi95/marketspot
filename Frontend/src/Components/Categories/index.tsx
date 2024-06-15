import { Box, rem } from "@mantine/core";
import { ICategory, IDeleteCategory } from "../../Types/Category";
import CornerIcon from "../CornerIcon";
import { useMemo } from "react";
import {  openDeleteModal } from "../Modal/index";

interface Props {
  categories: ICategory[];
  parentId: string;
  activeTrashIcon: boolean;
  AddNewParentCategory: (value: ICategory)=> void;
  handleDeleteCategory?: (value: IDeleteCategory) => void;
}
function Categories({ categories, parentId, activeTrashIcon, AddNewParentCategory, handleDeleteCategory}: Props) {
  const categoryList = useMemo(() => {
    function GetCategoryByParentId(parentId: string) {
      return categories
        .filter((x) => x.parentId === parentId)
        .map((x) => {
          const title = `Deleting "${x.name}"`;
          const confirmationText = `Are you sure you want to delete "${x.name}"`;
          const action = ()=>
           { if (handleDeleteCategory) {
              handleDeleteCategory( {id:x.id} as IDeleteCategory);              
            }}
          return (
            <Box ml={rem(10)} mr={rem(10)} key={x.id}>
              <CornerIcon Action={()=>openDeleteModal(action, title , confirmationText)} value={x.id} active={activeTrashIcon}>
                <Box
                  className="pointer"
                  p={rem(10)}
                  bg={"white"}
                  style={{
                    border:
                      "calc(.0625rem*var(--mantine-scale)) solid var(--main-color)",
                    borderRadius: "var(--mantine-radius-xs)",
                    borderWidth: "1px"
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
  }, [AddNewParentCategory, categories, handleDeleteCategory, parentId]);

  return <>{categoryList}</>;
}

export default Categories;
