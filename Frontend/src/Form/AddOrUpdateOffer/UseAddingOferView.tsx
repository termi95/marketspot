import { FileWithPath } from "@mantine/dropzone";
import { useEffect, useState } from "react";
import { ICategory } from "../../Types/Category";
import { MainOfferView, OfferAddDto } from "../../Types/Offer";
import { INotyfication } from "../../Types/Notyfication";
import { Api } from "../../Helpers/Api/Api";
import { useNavigate } from "react-router-dom";
import { Helper } from "../../Types/Helper";
import GeneralHelper from "../../Helpers/general/general";

const mainCategoryId = Helper.EmptyGuid;

const addEndpoint = "Offer/add";
const GetUserOffersEndpoint = "Offer/Get-by-id";
const addNotification: INotyfication = {
  Title: "Adding",
  Message: "Adding offer.",
  SuccessMessage: "offer was added successfully.",
};

interface Props {
  id: string | undefined | null;
}

function UseAddingOferView({ id }: Props) {
  const { PostRequest } = Api();
  const { IsNullOrEmpty } = GeneralHelper();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<string | number>(0);
  const [category, setCategory] = useState<ICategory>({
    id: mainCategoryId,
    name: "Main Category",
    parentId: mainCategoryId,
  });
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (!IsNullOrEmpty(id)) {
      GetOffer(signal);
    }
    return () => {
      controller.abort();
    };
  }, []);

  async function GetOffer(signal: AbortSignal) {
    try {
      setLoading(true);
      const reqResult = await PostRequest<MainOfferView>(
        GetUserOffersEndpoint,
        { id },
        undefined,
        signal
      );
      if (!reqResult.isError && reqResult.result !== undefined) {
        setTitle(reqResult.result.tittle);
        setPrice(reqResult.result.price);
        setDescription(reqResult.result.description);
      }
    } catch (error) {
      /* empty */
    } finally {
      setLoading(false);
    }
  }

  function removePhoto(index: number) {
    setFiles([...files.slice(0, index), ...files.slice(index + 1)]);
  }

  const getBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve) => {
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
    const base64Img = await Promise.all(files.map((x) => getBase64(x)));
    const payload: OfferAddDto = {
      description: description,
      price: price as number,
      tittle: title,
      categoryId: category.id,
      photos: base64Img,
    };
    const result = await PostRequest<string>(
      addEndpoint,
      payload,
      addNotification
    );
    if (!result.isError && result.result !== undefined) {
      navigate(`/offer/${result.result}`);
    }
  }

  return {
    setFiles,
    setDescription,
    setCategory,
    setTitle,
    removePhoto,
    setPrice,
    submit,
    IsNullOrEmpty,
    files,
    title,
    category,
    description,
    mainCategoryId,
    price,
    loading,
  };
}

export default UseAddingOferView;
