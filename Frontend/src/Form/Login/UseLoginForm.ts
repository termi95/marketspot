import { useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { Notification } from "../../Helpers/Notification/Notification";
import { ReqType } from "../../Types/Configuration";
import { IUserLogin } from "../../Types/User";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLogin } from "../../State/User/userSlice";

const endPoint = "User/Login";

export function UseLoginForm() {
  const { Request, SaveToken } = Api();
  const { UpdateToSuccess, Loading, ErrorOrSucces } = Notification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function Login(user: IUserLogin) {
    const toastId = "Login";
    let isError = false;
    let responeMessage = "Logined successfully.";
    Loading(toastId, "Login", "Login is procesing.");
    try {
      const respone = await Request(ReqType.POST, endPoint, user);
      if (respone.isSuccess) {
        UpdateToSuccess(toastId, responeMessage);
        SaveToken(respone.result as unknown as string);
        dispatch(setIsLogin(true))
        return navigate("/");
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
  async function LoginOnEnter(
    user: IUserLogin,
    e: React.KeyboardEvent<HTMLElement>
  ) {
    const { key } = e;
    if (key === "Enter") {
      return await Login(user);
    }
    return false;
  }
  return { Login, LoginOnEnter, setEmail, setPassword, email, password };
}
