import { FileWithPath } from "@mantine/dropzone";
import { useEffect, useState } from "react";
import { ICategory, IGetCategory } from "../../Types/Category";
import { Api } from "../../Helpers/Api/Api";
import { INotyfication } from "../../Types/Notyfication";
import { useHover } from "@mantine/hooks";

const mainCategoryId = "00000000-0000-0000-0000-000000000000";
const getEndpoint = "Category/GetCategoryByParentId";

const getNotification: INotyfication = {
    Title: "Fetching",
    Message: "",
    SuccessMessage: "Category was successfully fetched.",
    OnlyError: true,
  };

type CategorySelect ={
    label: string,
     value: string
}

function UseAddingOferView() { 
    const { PostRequest } = Api();
    const [files, setFiles] = useState<FileWithPath[]>([]);
    const [title, setTitle] = useState<string>("");
    const [category, setCategory] = useState<CategorySelect>({label:"",value:mainCategoryId});
    const [description, setDescription] = useState<string>("");
    const [selectData, setSelectData] = useState<CategorySelect[]>([]);
    const { hovered, ref } = useHover<HTMLButtonElement>();

    useEffect(() => {
        let mounted = true;
        getCategory(category.value, mounted)
        return () => {
            mounted = false
        };
      }, []);
       
  function removePhoto(index: number) {
    setFiles([...files.slice(0, index), ...files.slice(index + 1)]);
  }

  async function getCategory(parentId:string, mounted:boolean) {    
    const category: IGetCategory = { parentId };    
    const result = await PostRequest<ICategory[]>(
        getNotification,
        getEndpoint,
        category
      );    
      
    if (mounted && !result.isError && result.result !== undefined) {
        if (result.result !== undefined && result.result[0] !== undefined) {
            console.log(result.result)
            setSelectData([...result.result.map((x)=>{ return {value:x.id, label:x.name }as CategorySelect})]);
        }        
      }
  }

    return {setFiles, setDescription, setCategory, setTitle, removePhoto, getCategory, files, title, category, description, selectData, hovered, ref}
}

export default UseAddingOferView