import { FileWithPath } from "@mantine/dropzone";
import { useState } from "react";
import { ICategory } from "../../Types/Category";
import { useHover } from "@mantine/hooks";
import { OfferAddDto } from "../../Types/Offer";
import { INotyfication } from "../../Types/Notyfication";
import { Api } from "../../Helpers/Api/Api";

const mainCategoryId = "00000000-0000-0000-0000-000000000000";

const addEndpoint = "Offer/add";
const addNotification: INotyfication = {
  Title: "Adding",
  Message: "Adding offer.",
  SuccessMessage: "offer was added successfully.",
  OnlyError: false,
};

function UseAddingOferView() {
  const { PostRequest } = Api();
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<string |number>(0);
  const [category, setCategory] = useState<ICategory>({id:mainCategoryId,name:"Main Category", parentId:mainCategoryId});
  const [description, setDescription] = useState<string>("");
  const { hovered, ref } = useHover<HTMLButtonElement>();
       
  function removePhoto(index: number) {
    setFiles([...files.slice(0, index), ...files.slice(index + 1)]);
  }

  const getBase64 = (file: Blob): Promise<string> => {
    return new Promise(resolve => {
      let baseURL = "";
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL = reader.result as string;
        resolve(baseURL);
      };
    });
  };

  async function submit() {
  const base64Img = await Promise.all(files.map(x=> getBase64(x)));
  const payload: OfferAddDto =
  {
    description :description,
    price: price as number,
    tittle: title,
    categoryId: category.id,
    photos: base64Img
  }
  console.log(payload);
  const result = await PostRequest<unknown>(
    addNotification,
    addEndpoint,
    payload
  );
  console.log(result);
  }

    return {setFiles, setDescription, setCategory, setTitle, removePhoto, setPrice, submit, files, title, category, description, hovered, ref, mainCategoryId, price}
}

export default UseAddingOferView