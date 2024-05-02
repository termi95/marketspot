import { ApiResponse } from "../../Types/ApiResponse";
import { ReqType } from "../../Types/Configuration";
import { config } from "../../configuration";

export function Api() {
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

  function isTokenExpired() {
    const expired = getExpiredDateOfToken();
    if (expired) {
      return Date.now() >= expired;
    }
    RemoveToken();
    return true;
  }

  return {
    Request,
    SaveToken,
    RemoveToken,
    isTokenExpired,
  };
}
