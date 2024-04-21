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
        "content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${GetToken()}`,
      }),
      cache: "default",
    };

    if (method === ReqType.POST || method === ReqType.PUT) {
      requestConfig.body = JSON.stringify(payload);
    }
    const respone = await fetch(url.toString(), requestConfig);

    const apiResponse = await respone.json() as unknown as ApiResponse;
    return apiResponse;
  }

  function SaveToken(token: string) {
    localStorage.setItem("Token", token);
  }

  function GetToken() {
    try {
      localStorage.getItem("Token");
    } catch (error) {
      return "";
    }
  }
  return {
    Request,
    SaveToken,
  };
}
