import { Api } from "../../Helpers/Api/Api";
import { Notification } from "../../Helpers/Notification/Notification";
import { ReqType } from "../../Types/Configuration";
import { IUserRegister } from "../../Types/User";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

const endPoint = "User/register";

interface Props {
  toggleForm: (flag: boolean) => void;
}
export function UseRegisterForm({ toggleForm }: Props) {
  const { Request } = Api();
  const { UpdateToSuccess, Loading, ErrorOrSucces } = Notification();

  async function Register(user: IUserRegister) {
    const toastId = "Register";
    let isError = false;
    let responeMessage = "Registered successfully.";
    Loading(toastId, "Register", "Register is procesing.");
    try {
      const respone = await Request(ReqType.POST, endPoint, user);
      if (respone.isSuccess) {
        UpdateToSuccess(toastId, responeMessage);
        toggleForm(true)
        return true;
      }
      responeMessage = respone.errorsMessages.join("\r\n");
      isError = true;
    } catch (error) {
      responeMessage = (error as Error).message;
      isError = true;
    } finally {
      ErrorOrSucces(toastId, responeMessage, isError);
    }
    return false;
  }
  async function RegisterOnEnter(
    user: IUserRegister,
    e: React.KeyboardEvent<HTMLElement>
  ) {
    const { key } = e;
    if (key === "Enter") {
      return await Register(user);
    }
    return false;
  }
  return { Register, RegisterOnEnter };
}
