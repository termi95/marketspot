import { useCallback, useEffect, useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import {
  IAddOrUpdateCategory,
  ICategory,
  IDeleteCategory,
  IGetCategory,
} from "../../Types/Category";
import { INotyfication } from "../../Types/Notyfication";
const addEndpoint = "Category/add";
const deleteEndpoint = "Category/delete";
const getEndpoint = "Category/GetCategoryByParentId";
const addNotification: INotyfication = {
  Title: "Adding",
  Message: "Adding category.",
  SuccessMessage: "Category was added successfully.",
  OnlyError: false,
};
const deleteNotification: INotyfication = {
  Title: "Deleting",
  Message: "",
  SuccessMessage: "Category was Deleted successfully.",
  OnlyError: false,
};
const mainCategoryId = "00000000-0000-0000-0000-000000000000";
const getNotification: INotyfication = {
  Title: "",
  Message: "",
  SuccessMessage: "",
  OnlyError: true,
};
const initialCategory = { name: "", parentId: "", id: "" };
const initialParentCategory = {
  name: "Main category",
  parentId: mainCategoryId,
  id: mainCategoryId,
};
export function UseAddingCategory() {
  const { PostRequest } = Api();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [parentCategory, setParentCategory] = useState<ICategory[]>([initialParentCategory,]);
  const [newCategory, setNewCategory] = useState<ICategory>(initialCategory);
  const [parentId, setParentId] = useState<string>(mainCategoryId);

  useEffect(() => {
    GetCategoryLevel();
  }, [parentId]);

  async function AddCategory(category: IAddOrUpdateCategory) {
    category.parentId = parentId;
    const result = await PostRequest<IAddOrUpdateCategory>(
      addNotification,
      addEndpoint,
      category
    );
    if (!result.isError) {
      GetCategoryLevel();
      setNewCategory(initialCategory);
    }
  }

  function setNewCategoryName(name: string) {
    setNewCategory((prev) => ({ ...prev, name:capitalizeFirstLetter(name) }));
  }

  function capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async function handleDeleteCategory(category: IDeleteCategory) {
    const result = await PostRequest<IDeleteCategory>(
      deleteNotification,
      deleteEndpoint,
      category
    );
    if (!result.isError) {
      GetCategoryLevel();
    }    
  }

  function setNewParentId(ParentId: string) {
    const timeline = TimelineOrder(ParentId, parentCategory);
    setParentCategory([...orderParentCategory(parentCategory, timeline)])
    setParentId(ParentId);
  }

  function TimelineOrder(ParentId: string, parentCategory: ICategory[]): ICategory[] {
    let result: ICategory[] = [];    
    const matchingCategories = parentCategory.filter(category => category.id === ParentId);
    
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

  function orderParentCategory(firstArray: ICategory[], secondArray: ICategory[]): ICategory[]  {
    const indexMap = new Map();
    firstArray.forEach((item, index) => indexMap.set(item, index));
  
    secondArray.sort((a, b) => {
      const indexA = indexMap.get(a);
      const indexB = indexMap.get(b);
      return indexA - indexB;
    });
  
    return secondArray;
  }

  const AddNewParentCategory = useCallback((category: ICategory) => {
    setParentCategory([...parentCategory, category]);
    setParentId(category.id);
  }, [parentCategory, setParentCategory, setParentId]);
  
  function handleAddCategory () {
    AddCategory({ ...newCategory });
  }

  async function GetCategoryLevel() {
    const category: IGetCategory = { parentId };
    const result = await PostRequest<ICategory[]>(
      getNotification,
      getEndpoint,
      category
    );
    if (!result.isError && result.result !== undefined) {
      setCategories(result.result);
      if (result.result !== undefined && result.result[0] !== undefined &&result.result[0].parentId !== parentId) {
        setNewParentId(result.result[0].parentId);
      }
    }
  }

  async function AddCategoryOnEnter(
    category: IAddOrUpdateCategory,
    e: React.KeyboardEvent<HTMLElement>
  ) {
    const { key } = e;
    if (key === "Enter") {
      return await AddCategory(category);
    }
    return false;
  }
  return {
    AddCategory,
    AddCategoryOnEnter,
    setCategories,
    setNewCategoryName,
    AddNewParentCategory,
    handleAddCategory,
    setNewParentId,
    handleDeleteCategory,
    categories,
    newCategory,
    parentId,
    mainCategoryId,
    parentCategory,
  };
}
