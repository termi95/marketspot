export interface IUserRegister {
  Name: string;
  Surname: string;
  Email: string;
  Password: string;
}

export interface IUserLogin {
  Email: string;
  Password: string;
}

export interface IUserChangePasswordRequest {
  Email: string;
}

export interface IUserChangePassword {
  Password: string;
  PasswordChangeToken: string;
}

export enum UserRole {
  User = 0,
  Admin = 1,
}

export type BasicUserInfo = {
  id: string,
  name: string,
  surname: string,
  email: string
  creationDate: string
}
