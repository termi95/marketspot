import { useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { IUserLogin } from "../../Types/User";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLogin } from "../../State/User/userSlice";
import { INotyfication } from "../../Types/Notyfication";

const loginEndpoint =  "User/Login";
const loginNotification : INotyfication={Title:"Login", Message:"Login is procesing.", SuccessMessage:"Logined successfully.", OnlyError: false}

export function UseLoginForm() {
  const { PostRequest, SaveToken } = Api();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function Login(user: IUserLogin) {
    console.log(user)
    const reqResult = await PostRequest<string>(loginNotification, loginEndpoint, user)
    if (!reqResult.isError && reqResult.result !== undefined) {
      SaveToken(reqResult.result);
      dispatch(setIsLogin(true))
      return navigate("/");      
    }
  }
  async function LoginOnEnter(
    user: IUserLogin,
    e: React.KeyboardEvent<HTMLElement>
  ) {
    const { key } = e;
    if (key === "Enter") {
      e.preventDefault();
      return await Login(user);
    }
    return false;
  }
  return { Login, LoginOnEnter, setEmail, setPassword, email, password };
}
