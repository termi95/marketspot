import { ICategory } from "./Category";
import { BasicUserInfo } from "./User";

export type OfferAddDto = {
  tittle: string;
  description: string;
  price: number;
  categoryId: string;
  photos: string[];
};

export type UserOffer = {
  id: string;
  likeId: string;
  tittle: string;
  creationDate: string;
  description: string;
  price: number;
  photo: string;
  user: BasicUserInfo;
  category: ICategory;
};

export type MainOfferView = {
  id: string;
  likeId: string;
  tittle: string;
  creationDate: string;
  description: string;
  price: number;
  photos: string[];
  user: BasicUserInfo;
  category: ICategory;
};

export type UserOfferList = UserOffer & {action: object}

