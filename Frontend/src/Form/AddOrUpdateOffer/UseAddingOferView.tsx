import { FileWithPath } from "@mantine/dropzone";
import { useEffect, useState } from "react";
import { AddOfferState, Condytion, DeliveryType, MainOfferView, OfferAddDto, OfferUpdateDto } from "../../Types/Offer";
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
}; const updateNotification: INotyfication = {
  Title: "Update",
  Message: "Updating offer.",
  SuccessMessage: "offer was updated successfully.",
};

interface Props {
  id: string | undefined | null;
}

const initState: AddOfferState = {  
  price: 0,
  title: '',
  description: '',
  deliveryType: DeliveryType.Shipping,
  condytion: Condytion.New,
  photos: [],
  categoryId: Helper.EmptyGuid,
  category: {
    id: mainCategoryId,
    name: "Main Category",
    parentId: mainCategoryId,
  },
  loading: false,
  pickupAddress: {
    city: "",
    phone: "",
    street: "",
  }
}

function UseAddingOferView({ id }: Props) {
  const { PostRequest } = Api();
  const { IsNullOrEmpty } = GeneralHelper();
  const navigate = useNavigate();
  const [data, setData] = useState<AddOfferState>(initState);
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const setLoading = (value: boolean) => setData(prev => ({ ...prev, loading: value }));
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (IsNullOrEmpty(id)) {
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
        const { tittle, category, price, description, photos } = reqResult.result;
        if (tittle && category && price && description && photos) {
          setData(prev => ({
            ...prev,
            title: tittle,
            price: price,
            description: description,
            category: category,
            photos: photos
          }))
        }
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
      description: data.description,
      price: data.price as number,
      tittle: data.title,
      categoryId: data.category.id,
      photos: base64Img,
      condytion: data.condytion,
      deliveryType: data.deliveryType,
      pickupAddress: data.pickupAddress
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
      description: data.description,
      price: data.price as number,
      tittle: data.title,
      categoryId: data.category.id,
      photos: await GetPhotosPayload(),
      condytion: data.condytion,
      deliveryType: data.deliveryType,
      pickupAddress: data.pickupAddress
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
    removePhoto,
    submit,
    IsNullOrEmpty,
    GetPreview,
    setData,
    files,
    mainCategoryId,
    data,
  };
}

export default UseAddingOferView;
