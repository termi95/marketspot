import { useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { IUserLogin } from "../../Types/User";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLogin, setUserRole } from "../../State/User/userSlice";

const loginEndpoint = "User/Login";

export function UseLoginForm() {
  const { state } = useLocation();
  const fromOffer = state?.fromOffer;
  const offer = state?.offer;
  const { PostRequest, SaveToken, GetUserRole } = Api();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function Login(user: IUserLogin) {
    const reqResult = await PostRequest<string>(loginEndpoint, user)
    if (!reqResult.isError && reqResult.result !== undefined) {
      SaveToken(reqResult.result);
      dispatch(setIsLogin(true))
      dispatch(setUserRole(GetUserRole()))
      if (fromOffer && offer) {
        navigate("/checkout", { state: { offer } });
      } else {
        navigate("/");
      }
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
