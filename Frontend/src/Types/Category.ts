export interface ICategory {
  Id: string;
  ParentId: string;
  Name: string;
}
export interface IAddOrUpdateCategory {
  ParentId: string;
  Name: string;
}
export interface IDeleteCategory {
  Id: string;
}
