import { useEffect, useRef, useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { INotyfication } from "../../Types/Notyfication";
import { BasicUserInfo, UserRole } from "../../Types/User";

const PersonalInformationEndpoint =  "User/get-info";
const PersonalInformationNotification : INotyfication={Title:"Personal Information", Message:"Get personal information.", SuccessMessage:"Personal information get successfully."}

const UpdatePersonalInformationEndpoint =  "User/update-info";
const UpdatePersonalInformationNotification : INotyfication={Title:"Personal Information", Message:"Update is procesing.", SuccessMessage:"Personal information updated successfully."}

export function UsepersonalInformation() {
    const { PostRequest, GetUserRole } = Api();
    const InitialUser = useRef<BasicUserInfo>();
    const [user, setUser] = useState<BasicUserInfo>({email:"",id:"",name:"",surname:""});
    const [userRole, setUserRole] = useState<string>(UserRole.User.toString());
    

  useEffect(() => {
    let ignore = false;
    async function GetUser() {
      if (!ignore) 
      {
        const reqResult = await PostRequest<BasicUserInfo>(PersonalInformationEndpoint, {}, PersonalInformationNotification)
        if (!reqResult.isError && reqResult.result !== undefined)
        {
                InitialUser.current = reqResult.result;            
                setUser(reqResult.result);
                setUserRole(UserRole[GetUserRole()])
        }
      }
    }
    GetUser()
    return () => {
        ignore = true;
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function ChangeUserProp(param:string, paramName:string) {
    switch (paramName) {
        case "Name":
            setUser({...user, name: param})
            break;
        case "Surname":
            setUser({...user, surname: param})
            break;    
        case "Email":
            setUser({...user, email: param})
            break;        
        default:
            break;
    }
  }
  async function Submit() {
    const reqResult = await PostRequest<BasicUserInfo>(UpdatePersonalInformationEndpoint, user, UpdatePersonalInformationNotification)
    if (!reqResult.isError && reqResult.result !== undefined) {
        InitialUser.current = reqResult.result;            
        setUser(reqResult.result);
        setUserRole(UserRole[GetUserRole()])
    }
  }
  async function SubmitOnEnter(
    e: React.KeyboardEvent<HTMLElement>
  ) {
    const { key } = e;
    if (key === "Enter") {
      e.preventDefault();
      return await Submit();
    }
    return false;
  }  

    return {user, userRole, ChangeUserProp, Submit, SubmitOnEnter}
}