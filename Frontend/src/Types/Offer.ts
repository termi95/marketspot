import { ICategory } from "./Category";
import { BasicUserInfo } from "./User";

export type OfferAddDto = {
  tittle: string;
  description: string;
  price: number;
  categoryId: string;
  photos: string[];
  condytion: Condytion;
  deliveryType: DeliveryType;
  pickupAddress: OfferAddress;
  
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

export enum DeliveryType {
  Shipping = "Shipping",
  LocalPickup = "LocalPickup"
}

export enum Condytion {
  New = "New",
  Used = "Used"
}

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
  likesCount: number;
};

export type SearchQuery = {
  itemPerPage: number;
  searchText: string;
  page: number;
  sortBy: SortBy;
  categoryId: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
};

export type SortBy = 'PriceDesc' | 'PriceAsc' | 'CreatedDateDesc' | 'CreatedDateAsc' | 'SearchTextDesc' | 'SearchTextAsc';

export type UserOfferList = UserOffer & { action: object };
