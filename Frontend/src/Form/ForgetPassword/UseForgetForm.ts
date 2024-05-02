import { useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { Notification } from "../../Helpers/Notification/Notification";
import { ReqType } from "../../Types/Configuration";
import { IUserChangePasswordRequest } from "../../Types/User";
import { useNavigate } from "react-router-dom";

const endPoint = "User/change-password-request";

export function UseForgetForm() {
  const { Request } = Api();
  const { UpdateToSuccess, Loading, ErrorOrSucces } = Notification();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function SendRequest(user: IUserChangePasswordRequest) {
    const toastId = "Forget";
    let isError = false;
    let responeMessage = "Request was send successfully.";
    Loading(toastId, "Request", "Request is procesing.");
    try {
      const respone = await Request(ReqType.POST, endPoint, user);
      if (respone.isSuccess) {
        UpdateToSuccess(toastId, responeMessage);
        return navigate("/login");
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
  async function SendRequestOnEnter(
    user: IUserChangePasswordRequest,
    e: React.KeyboardEvent<HTMLElement>
  ) {
    const { key } = e;
    if (key === "Enter") {
      return await SendRequest(user);
    }
    return false;
  }
  return { SendRequest, SendRequestOnEnter, setEmail, email };
}
