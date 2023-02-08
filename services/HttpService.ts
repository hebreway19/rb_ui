import { RequestParams, SendRequest } from "../types";
import { useEffect, useRef } from "react";
import { useRequest } from "../providers";
import { RequestUtil } from "../util";

export abstract class HttpService {
  constructor(private _request: SendRequest) {
  }

  public set request(newRequest) {
    this._request = newRequest;
  }

  protected async _sendRequest<T = any>(requestParams: RequestParams): Promise<T> {
    return this._request(requestParams);
  }
}

export const useHttpService = <T extends HttpService>(clazz: new (sendRequest: SendRequest) => T, customSendRequest?: SendRequest) => {
  const {sendRequest} = useRequest();
  const serviceRef = useRef<T>(new clazz(customSendRequest || sendRequest));
  useEffect(() => {
      if (serviceRef.current) {
        serviceRef.current.request = customSendRequest || sendRequest || RequestUtil.sendRequest;
      } else {
        serviceRef.current = new clazz(customSendRequest || sendRequest || RequestUtil.sendRequest);
      }
  }, [customSendRequest, sendRequest, clazz]);
  return serviceRef.current;
};

export const createUseHttpService = <T extends HttpService>(clazz: new (request: SendRequest) => T) => (sendRequest?: SendRequest) => useHttpService<T>(clazz, sendRequest);