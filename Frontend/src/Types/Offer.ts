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
  tittle: string;
  description: string;
  price: number;
  photo: string;
  user: BasicUserInfo;
  category: ICategory;
};

export type UserOfferList = UserOffer & {action: object}
export type Offer = UserOffer 

