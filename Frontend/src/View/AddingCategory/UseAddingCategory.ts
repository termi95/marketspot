import { useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { IAddOrUpdateCategory, ICategory } from "../../Types/Category";
import { INotyfication } from "../../Types/Notyfication";
const addEndpoint = "Category/add";
const addNotification: INotyfication={Title:"Adding", Message:"Adding category.", SuccessMessage:"Category was added successfully."}
const initialCategory = {Name:"",ParentUid:"",Uid:""}

export function UseAddingCategory() {
  const { PostRequest } = Api();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategory, setNewCategory] = useState<ICategory>(initialCategory);

  async function AddCategory(category: IAddOrUpdateCategory) {
    PostRequest<IAddOrUpdateCategory>(addNotification,addEndpoint,category )
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
  return { AddCategory, AddCategoryOnEnter, setCategories, setNewCategory, categories, newCategory };
}
