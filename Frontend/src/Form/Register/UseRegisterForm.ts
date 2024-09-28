import { Api } from "../../Helpers/Api/Api";
import { IUserRegister } from "../../Types/User";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { INotyfication } from "../../Types/Notyfication";

const Endpoint =  "User/register";
const ForgetNotification : INotyfication={Title:"Register", Message:"Register is procesing.", SuccessMessage:"Registered successfully.", OnlyError: false}

interface Props {
  toggleForm: (flag: boolean) => void;
}
export function UseRegisterForm({ toggleForm }: Props) {
  const { PostRequest } = Api();

  async function Register(user: IUserRegister) {
    const reqResult = await PostRequest<object>(Endpoint, user, ForgetNotification)
    if (!reqResult.isError) {
      toggleForm(true);
    }
  }
  
  async function RegisterOnEnter(
    user: IUserRegister,
    e: React.KeyboardEvent<HTMLElement>
  ) {
    const { key } = e;
    if (key === "Enter") {        
      e.preventDefault();
      return await Register(user);
    }
    return false;
  }
  return { Register, RegisterOnEnter };
}
