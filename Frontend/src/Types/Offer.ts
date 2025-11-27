import { ICategory } from "./Category";
import { BasicUserInfo } from "./User";

type Offer = {
  id: string;
  tittle: string;
  description: string;
  price: number;
  isBought: boolean;
  condytion: number;
  deliveryType: number;
  creationDate: string;
  likeId: string;
  photos: string[];
  photo: string;
  user: BasicUserInfo;
  category: ICategory;
  pickupAddress: OfferAddress;
}

export type SimpleOfferList = Omit<Offer, "photos" | "category" | "pickupAddress"> & {

  userId: string;
  isLiked: boolean;
  likesCount: number;
};

export type GetOfferUpdateDto = Omit<Offer, "user" | "likeId" | "creationDate" | "isBought" | "photo">;
export type OfferUpdateDto = Omit<Offer, "user" | "likeId" | "creationDate" | "isBought" | "photo" | "category"> & { categoryId: string };
export type OfferAddDto = Omit<Offer,"id" | "isBought" | "user" | "likeId" | "creationDate" | "photo" | "category"> & {categoryId: string;};
export type UserOffer = Omit<Offer,"photos" | "isBought" | "pickupAddress" | "deliveryType" | "condytion">;

export enum DeliveryType {
  Shipping = "Shipping",
  LocalPickup = "LocalPickup"
}
export const NumberToDeliveryType: Record<number, DeliveryType> = {
  0: DeliveryType.Shipping,
  1: DeliveryType.LocalPickup,
};
export const DeliveryTypeToNumber: Record<DeliveryType, number> = {
  [DeliveryType.Shipping]: 0,
  [DeliveryType.LocalPickup]: 1,
};

export enum Condytion {
  New = "New",
  Used = "Used"
}
export const NumberToCondytion: Record<number, Condytion> = {
  0: Condytion.New,
  1: Condytion.Used,
};
export const CondytionToNumber: Record<Condytion, number> = {
  [Condytion.New]: 0,
  [Condytion.Used]: 1,
};

export type AddOfferState = {
  title: string;
  description: string;
  categoryId: string;
  condytion: Condytion;
  deliveryType: DeliveryType;
  price: string | number;
  category: ICategory;
  loading: boolean;
  photos: string[];
  pickupAddress: OfferAddress;
}

export type OfferAddress = {
  city: string,
  phone: string,
  street: string,
}

export type CheckoutOffer = Omit<MainOfferView, "likeId" | "category">;

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
  condytion: number;
  deliveryType: number;
};


export type SearchQuery = {
  itemPerPage: number;
  searchText: string;
  page: number;
  sortBy: SortBy;
  categoryId: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  deliveryType: number | undefined;
  condytion: number | undefined;
};

export type SortBy = 'PriceDesc' | 'PriceAsc' | 'CreatedDateDesc' | 'CreatedDateAsc' | 'SearchTextDesc' | 'SearchTextAsc';

export type UserOfferList = UserOffer & { action: object };
