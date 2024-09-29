import { useEffect, useRef, useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { INotyfication } from "../../Types/Notyfication";
import { BasicUserInfo, UserRole } from "../../Types/User";
import OpenPasswordConfirmationModal from "../../Components/PasswordConfirmationAction";

const PersonalInformationEndpoint = "User/get-info";

const UpdatePersonalInformationEndpoint = "User/settings-personal-information";
const UpdatePersonalInformationNotification: INotyfication = {
  Title: "Personal Information",
  Message: "Update is procesing.",
  SuccessMessage: "Personal information updated successfully.",
};

export function UsepersonalInformation() {
  const { PostRequest, GetUserRole } = Api();
  const InitialUser = useRef<BasicUserInfo>();
  const [user, setUser] = useState<BasicUserInfo>({
    email: "",
    id: "",
    name: "",
    surname: "",
  });
  const [userRole, setUserRole] = useState<string>(UserRole.User.toString());

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function GetUser() {
      try {
        const reqResult = await PostRequest<BasicUserInfo>(
          PersonalInformationEndpoint,
          {},
          undefined,
          signal
        );
        if (!reqResult.isError && reqResult.result !== undefined) {
          InitialUser.current = reqResult.result;
          setUser(reqResult.result);
          setUserRole(UserRole[GetUserRole()]);
        }
      } catch (error) { /* empty */ }
    }
    GetUser();
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function ChangeUserProp(param: string, paramName: string) {
    switch (paramName) {
      case "Name":
        setUser({ ...user, name: param });
        break;
      case "Surname":
        setUser({ ...user, surname: param });
        break;
      case "Email":
        setUser({ ...user, email: param });
        break;
      default:
        break;
    }
  }
  async function Submit(password: string) {
    const reqResult = await PostRequest<BasicUserInfo>(
      UpdatePersonalInformationEndpoint,
      {...user, password},
      UpdatePersonalInformationNotification
    );
    if (!reqResult.isError && reqResult.result !== undefined) {
      InitialUser.current = reqResult.result;
      setUser(reqResult.result);
      setUserRole(UserRole[GetUserRole()]);
    }
  }
  async function SubmitOnEnter(e: React.KeyboardEvent<HTMLElement>) {
    const { key } = e;
    if (key === "Enter") {
      e.preventDefault();
      OpenPasswordConfirmationModal(Submit);
    }
    return false;
  }

  return { user, userRole, ChangeUserProp, Submit, SubmitOnEnter };
}
