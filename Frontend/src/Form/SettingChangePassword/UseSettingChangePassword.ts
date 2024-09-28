import { useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import OpenPasswordConfirmationModal from "../../Components/PasswordConfirmationAction";

const SettingsChangePasswordEndpoint =  "User/settings-change-password";
//const SettingsChangePasswordNotification : INotyfication={Title:"Changing password", Message:"New password is procesing.", SuccessMessage:"Password was updated successfully.", OnlyError: false}

export function UseSettingChangePassword() {
    const { PostRequest } = Api();
    const [passwordState, setPasswordState] = useState<{newPassword : string, newRePassword: string}>({newPassword:"", newRePassword:""});    

    function ChangePasswordProp(param:string, paramName:string) {
        switch (paramName) {
            case "newPassword":
              setPasswordState({...passwordState, newPassword: param})
                break;
            case "newRePassword":
              setPasswordState({...passwordState, newRePassword: param})
                break;      
            default:
                break;
        }
      }

    async function Submit(password: string) {
        await PostRequest(SettingsChangePasswordEndpoint, {password, ... passwordState})
      }
      async function SubmitOnEnter(
        e: React.KeyboardEvent<HTMLElement>
      ) {
        const { key } = e;
        if (key === "Enter") {
          e.preventDefault();
          OpenPasswordConfirmationModal(Submit);
        }
        return false;
      }
    return {Submit, SubmitOnEnter, ChangePasswordProp, passwordState}
}