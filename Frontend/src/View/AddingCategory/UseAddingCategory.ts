import { useEffect, useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { IAddOrUpdateCategory, ICategory, IGetCategory } from "../../Types/Category";
import { INotyfication } from "../../Types/Notyfication";
const addEndpoint = "Category/add";
const getEndpoint = "Category/GetCategoryByParentId";
const addNotification: INotyfication={Title:"Adding", Message:"Adding category.", SuccessMessage:"Category was added successfully.", OnlyError: false}
const getNotification: INotyfication={Title:"", Message:"", SuccessMessage:"", OnlyError: true}
const initialCategory = {name:"",parentId:"",id:""}

export function UseAddingCategory() {
  const { PostRequest } = Api();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategory, setNewCategory] = useState<ICategory>(initialCategory);
  const [parentId, setParentId] = useState<string>("00000000-0000-0000-0000-000000000000");

  useEffect(() => {
    GetCategoryLevel();
  }, [parentId]);

  async function AddCategory(category: IAddOrUpdateCategory) {
    const result = await  PostRequest<IAddOrUpdateCategory>(addNotification,addEndpoint,category )
    if (!result.isError) {
      GetCategoryLevel();
      setNewCategory(initialCategory);
    }
  }

  function setNewCategoryName(name:string) {
    setNewCategory((prev) => ({ ...prev, name }));
  }
  
  function setNewParentId(ParentId:string) {
    setParentId(ParentId);
  }

  async function GetCategoryLevel() {
    const category: IGetCategory = { parentId }
    const result = await PostRequest<ICategory[]>(getNotification,getEndpoint,category )
    if (!result.isError && result.result !== undefined) {
      setCategories(result.result);
      if (result.result[0].parentId !== parentId) {
        setNewParentId(result.result[0].parentId)        
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
  return { AddCategory, AddCategoryOnEnter, setCategories, setNewCategoryName, categories, newCategory, parentId };
}
