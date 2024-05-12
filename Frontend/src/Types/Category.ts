export interface ICategory {
  id: string;
  parentId: string;
  name: string;
}
export interface IAddOrUpdateCategory {
  parentId: string;
  name: string;
}
export interface IDeleteCategory {
  id: string;
}

export interface IGetCategory {
  parentId: string;
}
