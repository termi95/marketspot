import { Box, rem } from "@mantine/core";
import { ICategory } from "../../Types/Category";
import CornerIcon from "../CornerIcon";
import { useMemo } from "react";

interface Props {
  categories: ICategory[];
  parentId: string;
}
function Categories({ categories, parentId }: Props) {
  const categoryList = useMemo(() => {
    function GetCategoryByParentId(parentId: string) {
      return categories
        .filter((x) => x.parentId === parentId)
        .map((x) => {
          console.log(x.parentId);
          return (
            <Box ml={rem(10)} mr={rem(10)} key={x.id}>
              <CornerIcon Action={(value) => console.log(value)} value={x.id}>
                <Box
                  p={rem(10)}
                  bg={"white"}
                  style={{
                    border:
                      "calc(.0625rem*var(--mantine-scale)) solid var(--_input-bd)",
                    borderRadius: "var(--_input-radius)",
                  }}
                >
                  {x.name}
                </Box>
              </CornerIcon>
            </Box>
          );
        });
    }
    return GetCategoryByParentId(parentId);
  }, [categories, parentId]);

  return <>{categoryList}</>;
}

export default Categories;
