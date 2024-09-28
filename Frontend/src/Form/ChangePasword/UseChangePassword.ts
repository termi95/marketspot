import { Api } from "../../Helpers/Api/Api";
import { INotyfication } from "../../Types/Notyfication";
import { useNavigate } from "react-router-dom";
import { IUserChangePassword } from "../../Types/User";

const Endpoint =  "User/change-password";
const ForgetNotification : INotyfication={Title:"Request", Message:"Request is procesing.", SuccessMessage:"Request was send successfully."}

export function UseChangePassword() {
  const { PostRequest } = Api();
  const navigate = useNavigate();

  async function ChangePassword(user: IUserChangePassword) {
    const reqResult = await PostRequest<object>(Endpoint, user, ForgetNotification)
    if (!reqResult.isError) {
      return navigate("/login");
    }
  }
  async function ChangePasswordOnEnter(
    user: IUserChangePassword,
    e: React.KeyboardEvent<HTMLElement>
  ) {
    const { key } = e;
    if (key === "Enter") {
        e.preventDefault();
        return await ChangePassword(user);
    }
    return false;
  }
  return { ChangePassword, ChangePasswordOnEnter };
}