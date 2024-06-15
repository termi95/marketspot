import { useCallback, useEffect, useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { ICategory, IGetCategory } from "../../Types/Category";
import { INotyfication } from "../../Types/Notyfication";

const getEndpoint = "Category/GetCategoryByParentId";
const mainCategoryId = "00000000-0000-0000-0000-000000000000";
const getNotification: INotyfication = {
  Title: "",
  Message: "",
  SuccessMessage: "",
  OnlyError: true,
};
const initialParentCategory = {
  name: "Main category",
  parentId: mainCategoryId,
  id: mainCategoryId,
};
export function UseGetingCategory() {
  const { PostRequest } = Api();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [parentCategory, setParentCategory] = useState<ICategory[]>([
    initialParentCategory,
  ]);
  const [parentId, setParentId] = useState<string>(mainCategoryId);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    GetCategoryLevel();
  }, [parentId]);

  const setNewParentId = useCallback((ParentId: string) => {
    const timeline = TimelineOrder(ParentId, parentCategory);
    setParentCategory([...orderParentCategory(parentCategory, timeline)]);
    setParentId(ParentId);
  }, []);

  function getChosenCategory() {
    return parentCategory.filter(x=> x.id === parentId)[0];
  }

  function TimelineOrder(
    ParentId: string,
    parentCategory: ICategory[]
  ): ICategory[] {
    let result: ICategory[] = [];
    const matchingCategories = parentCategory.filter(
      (category) => category.id === ParentId
    );

    result = result.concat(matchingCategories);
    if (ParentId === mainCategoryId) {
      return result;
    }

    for (const category of matchingCategories) {
      const nestedCategories = TimelineOrder(category.parentId, parentCategory);
      result = result.concat(nestedCategories);
    }

    return result;
  }

  function orderParentCategory(
    firstArray: ICategory[],
    secondArray: ICategory[]
  ): ICategory[] {
    const indexMap = new Map();
    firstArray.forEach((item, index) => indexMap.set(item, index));

    secondArray.sort((a, b) => {
      const indexA = indexMap.get(a);
      const indexB = indexMap.get(b);
      return indexA - indexB;
    });

    return secondArray;
  }

  const AddNewParentCategory = useCallback(
    (category: ICategory) => {
      setParentCategory([...parentCategory, category]);
      setParentId(category.id);
    },
    [parentCategory, setParentCategory, setParentId]
  );

  async function GetCategoryLevel() {
    setLoading(true);
    const category: IGetCategory = { parentId };
    const result = await PostRequest<ICategory[]>(
      getNotification,
      getEndpoint,
      category
    );
    if (!result.isError && result.result !== undefined) {
      setCategories(result.result);
      if (
        result.result !== undefined &&
        result.result[0] !== undefined &&
        result.result[0].parentId !== parentId
      ) {
        setNewParentId(result.result[0].parentId);
      }
    }
    setLoading(false);
  }
  return {
    setCategories,
    AddNewParentCategory,
    setNewParentId,
    getChosenCategory,
    categories,
    parentId,
    mainCategoryId,
    parentCategory,
    loading,
  };
}
