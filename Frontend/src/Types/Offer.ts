import { ICategory } from "./Category";
import { BasicUserInfo } from "./User";

export type OfferAddDto = {
  tittle: string;
  description: string;
  price: number;
  categoryId: string;
  photos: string[];
};

export type OfferUpdateDto = OfferAddDto & { id: string };

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

export type CheckoutOffer = Omit<MainOfferView,"likeId" | "category">;

export enum PaymentMethod {
  Unknown = 0,
  CashOnDelivery = 1,
  BankTransfer = 2,
  Card = 3,
  Blik = 4,
  Paypal = 5,
}

export type DeliveryMethodId = "dpd" | "inpost" | "poczta" | "orlen";

export type DeliveryMethod = {
    id: DeliveryMethodId;
    name: string;
    description: string;
    price: number;
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
  isBought: boolean;
};

export type SimpleOfferList = {
  id: string;
  userId: string;
  likeId: string;
  photo: string;
  tittle: string;
  price: string;
  creationDate: string;
  isLiked: boolean;
};

export type SearchQuery = {
  searchText: string;
  page: number;
  sortBy: SortBy;
  categoryId: string;
  minPrice: number | string | undefined;
  maxPrice: number | string | undefined;
};

export type SortBy = 'PriceDesc' | 'PriceAsc' | 'CreatedDateDesc' | 'CreatedDateAsc' | 'SearchTextDesc' | 'SearchTextAsc';

export type UserOfferList = UserOffer & { action: object };
