import { FileWithPath } from "@mantine/dropzone";
import { useEffect, useState } from "react";
import { ICategory } from "../../Types/Category";
import { MainOfferView, OfferAddDto, OfferUpdateDto } from "../../Types/Offer";
import { INotyfication } from "../../Types/Notyfication";
import { Api } from "../../Helpers/Api/Api";
import { useNavigate } from "react-router-dom";
import { Helper } from "../../Types/Helper";
import GeneralHelper from "../../Helpers/general/general";
import ImageOfferAdding from "../../Components/ImageOfferAdding";
import { Image, rem } from "@mantine/core";

const mainCategoryId = Helper.EmptyGuid;

const addEndpoint = "Offer/add";
const updateEndpoint = "Offer/update";
const GetUserOffersEndpoint = "Offer/Get-by-id";
const addNotification: INotyfication = {
  Title: "Adding",
  Message: "Adding offer.",
  SuccessMessage: "offer was added successfully.",
};const updateNotification: INotyfication = {
  Title: "Update",
  Message: "Updating offer.",
  SuccessMessage: "offer was updated successfully.",
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
  const [photos, setPhotos] = useState<string[]>([]);
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

  useEffect(() => {
    setPhotos([])
  }, [files])  

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
        setCategory(reqResult.result.category);
        setPhotos(reqResult.result.photos);
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

  function GetPreview() {
    let preview;
    if (photos.length <= 0) {
      preview = files.map((file, index) => {
        return (
          <ImageOfferAdding
            key={file.name}
            imageUrl={URL.createObjectURL(file)}
            index={index}
            fileName={file.name}
            removePhoto={removePhoto}
          />
        );
      });
    } else {
      preview = photos.map((photo, index) => {
        return (
          <Image key={index} src={photo} mb={rem(10)} alt="Offert images" />
        );
      });
    }

    return preview;
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

  async function GetPhotosPayload() {
    return photos.length <= 0
      ? await Promise.all(files.map((x) => getBase64(x)))
      : photos;
  }

  async function Add() {
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

  async function Update() {
    const payload: OfferUpdateDto = {
      id: id!,
      description: description,
      price: price as number,
      tittle: title,
      categoryId: category.id,
      photos: await GetPhotosPayload(),
    };
    const result = await PostRequest<string>(
      updateEndpoint,
      payload,
      updateNotification
    );
    if (!result.isError && result.result !== undefined) {
      navigate(`/offer/${result.result}`);
    }
  }

  async function submit() {
    if (IsNullOrEmpty(id)) {
      await Add();
    } else {
      await Update();
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
    GetPreview,
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
