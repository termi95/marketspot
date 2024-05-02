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