import { FileWithPath } from "@mantine/dropzone";
import { useState } from "react";
import { ICategory } from "../../Types/Category";
import { useHover } from "@mantine/hooks";

const mainCategoryId = "00000000-0000-0000-0000-000000000000";

function UseAddingOferView() {
    const [files, setFiles] = useState<FileWithPath[]>([]);
    const [title, setTitle] = useState<string>("");
    const [category, setCategory] = useState<ICategory>({id:mainCategoryId,name:"Main Category", parentId:mainCategoryId});
    const [description, setDescription] = useState<string>("");
    const { hovered, ref } = useHover<HTMLButtonElement>();
       
  function removePhoto(index: number) {
    setFiles([...files.slice(0, index), ...files.slice(index + 1)]);
  }

    return {setFiles, setDescription, setCategory, setTitle, removePhoto, files, title, category, description, hovered, ref, mainCategoryId}
}

export default UseAddingOferView