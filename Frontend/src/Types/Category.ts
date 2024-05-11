export interface ICategory {
  Uid: string;
  ParentUid: string;
  Name: string;
}
export interface IAddOrUpdateCategory {
  ParentUid: string;
  Name: string;
}
export interface IDeleteCategory {
  Uid: string;
}
