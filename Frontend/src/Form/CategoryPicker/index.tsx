import { Box, Flex, Loader, rem, SimpleGrid } from "@mantine/core";
import { useEffect, useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { ICategory, IGetCategory } from "../../Types/Category";
import { Helper } from "../../Types/Helper";

interface Props {
  getLastPickCategoryId: (id: ICategory) => void;
}

const getEndpoint = "Category/GetCategoryByParentId";
function CategoryPicker({ getLastPickCategoryId }: Props) {
  const { PostRequest } = Api();
  const [parentId, setParentId] = useState<string>(Helper.EmptyGuid);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  async function GetCategoryLevel() {
    setLoading(true);
    const category: IGetCategory = { parentId };
    const result = await PostRequest<ICategory[]>(
      getEndpoint,
      category,
      undefined
    );
    if (!result.isError && result.result !== undefined) {
      setCategories(result.result);
      setLoading(false);
    }
  }

  useEffect(() => {
    GetCategoryLevel();
  }, [parentId]);

  const loader = (
    <Flex align={"center"} justify={"center"} mt={rem(30)}>
      <Loader color="blue" />
    </Flex>
  );

  return (
    <>
      <SimpleGrid cols={loading ? 1 : 3}>
        {loading
          ? loader
          : categories.map((x) => {
              return (
                <Box
                  mt={rem(30)}
                  key={x.id}
                  onClick={() => {
                    let category = undefined;
                    if (categories.length > 0) {
                      category = categories.find(
                        (category) => category.id === x.id
                      );
                    }
                    if (category != undefined) {
                      getLastPickCategoryId(category);
                      setParentId(x.id);
                    }
                  }}
                >
                  <Box
                    className="pointer"
                    p={rem(10)}
                    bg={"white"}
                    style={{
                      border:
                        "calc(.0625rem*var(--mantine-scale)) solid var(--main-color)",
                      borderRadius: "var(--mantine-radius-xs)",
                      borderWidth: "1px",
                    }}
                  >
                    {x.name}
                  </Box>
                </Box>
              );
            })}
      </SimpleGrid>
    </>
  );
}

export default CategoryPicker;
