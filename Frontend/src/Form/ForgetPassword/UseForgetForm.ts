import { useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { IUserChangePasswordRequest } from "../../Types/User";
import { useNavigate } from "react-router-dom";
import { INotyfication } from "../../Types/Notyfication";

const Endpoint = "User/change-password-request";
const ForgetNotification: INotyfication = {
  Title: "Request",
  Message: "Request is procesing.",
  SuccessMessage: "Request was send successfully.",
  OnlyError: false,
};

export function UseForgetForm() {
  const { PostRequest } = Api();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function SendRequest(user: IUserChangePasswordRequest) {
    const reqResult = await PostRequest<object>(
      ForgetNotification,
      Endpoint,
      user
    );
    if (!reqResult.isError) {
      return navigate("/login");
    }
  }
  async function SendRequestOnEnter(
    user: IUserChangePasswordRequest,
    e: React.KeyboardEvent<HTMLElement>
  ) {
    const { key } = e;
    if (key === "Enter") {
      e.preventDefault();
      await SendRequest(user);
    }
  }
  return { SendRequest, SendRequestOnEnter, setEmail, email };
}
