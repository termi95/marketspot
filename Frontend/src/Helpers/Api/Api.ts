import { ApiResponse } from "../../Types/ApiResponse";
import { ReqType } from "../../Types/Configuration";
import { INotyfication } from "../../Types/Notyfication";
import { UserRole } from "../../Types/User";
import { config } from "../../configuration";
import { Notification } from "../Notification/Notification";
import { v4 as uuidv4 } from "uuid";

export function Api() {
  const { Loading, ErrorOrSucces, ShowError } = Notification();
  const _baseUrl = config.url;
  async function Request(
    method: string,
    ep: string,
    payload: object
  ): Promise<ApiResponse> {
    const url = new URL(_baseUrl + ep);
    const requestConfig: RequestInit = {
      method: method,
      mode: "cors",
      headers: new Headers({
        Accept: "application/json",
        credentials: "same-origin",
        "content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${GetToken()}`,
      }),
      cache: "default",
    };

    if (method === ReqType.POST || method === ReqType.PUT) {
      requestConfig.body = JSON.stringify(payload);
    }
    const respone = await fetch(url.toString(), requestConfig);

    const apiResponse = (await respone.json()) as unknown as ApiResponse;
    return apiResponse;
  }

  function SaveToken(token: string) {
    localStorage.setItem("Token", token);
  }

  function RemoveToken() {
    localStorage.removeItem("Token");
  }

  function GetToken() {
    try {
      return localStorage.getItem("Token");
    } catch (error) {
      return "";
    }
  }
  function getExpiredDateOfToken(): number | undefined {
    const token: string | null = GetToken();
    if (token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const { exp } = JSON.parse(jsonPayload);
      const expired = exp * 1000;
      return expired;
    }
  }

  function isTokenExpired(): boolean {
    const expired = getExpiredDateOfToken();
    if (expired) {
      return Date.now() >= expired;
    }
    RemoveToken();
    return true;
  }
  async function PostRequest<T>(
    endpoint: string,
    payload: object,
    notification?: INotyfication | undefined
  ) {
    const toastId = uuidv4();
    let isError = false;
    let responeMessage = notification ?  notification.SuccessMessage: "";
    let result = undefined;
    if (notification != undefined) {
      Loading(toastId, notification.Title, notification.Message);      
    }
    try {
      const respone = await Request(ReqType.POST, endpoint, payload);
      if (!respone.isSuccess) {
        responeMessage = respone.errorsMessages.join("\r\n");
        isError = true;
      } else {
        result = <T>respone.result;
      }
    } catch (error) {
      responeMessage = (error as Error).message;
      isError = true;
    } finally {
      if (notification != undefined) {
        ErrorOrSucces(toastId, responeMessage, isError);        
      }
      else if (isError && notification == undefined) {
        ShowError("Error", responeMessage)
      }
    }
    return { isError, result };
  }

  function GetUserRole() {
    const token: string | null = GetToken();
    if (token) {
      const parts: string[] = token.split(".");
      const payload = JSON.parse(atob(parts[1]));
      const role: UserRole =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      return role !== undefined ? role : UserRole.User; 
    } else {
      return UserRole.User;
    }
  }
  return {
    Request,
    SaveToken,
    RemoveToken,
    isTokenExpired,
    PostRequest,
    GetUserRole,
  };
}
