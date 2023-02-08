import { stringify } from "qs";
import Cookies from "js-cookie";

import { HttpError } from "../shared/errors";
import { CacheMode, HttpContentType, HttpMethod, StorageKey } from "../constants";

const responseProcessors = {
  [HttpContentType.JSON]: async (response: Response) => {
    const text = await response.text();
    return text.length > 0 ? JSON.parse(text) : {};
  },
  [HttpContentType.TEXT]: async (response: Response) => response.text(),
  [HttpContentType.BLOB]: async (response: Response) => response.blob()
};

export class RequestUtil {

  public static async sendRequest<T = any>({
                                             queryParams = {},
                                             isAuthorized = false,
                                             cacheMode = CacheMode.DEFAULT,
                                             requestType = HttpContentType.JSON,
                                             responseType = HttpContentType.JSON,
                                             additionalHeaders = {},
                                             method,
                                             uri,
                                             body = {},
                                             token = undefined,
                                             credentials = "omit"
                                           }): Promise<T> {
    const headers: Headers = new Headers(additionalHeaders);
    Object.keys(additionalHeaders).forEach(headerName => headers.set(headerName, additionalHeaders[headerName]));
    let finalContentType = String(requestType);
    if (requestType === HttpContentType.MULTIPART) {
      finalContentType = undefined;
    }
    if (finalContentType) {
      headers.set("Content-Type", String(finalContentType));
    }
    headers.set("Accept", String(responseType) || "*/*");
    if (isAuthorized) {
      const actualToken = token || Cookies.get(StorageKey.JWT);
      headers.set("Authorization", `Bearer ${actualToken}`);
    }
    const request: RequestInit = {
      method,
      headers,
      cache: cacheMode,
      credentials,
      body: RequestUtil._getBodyIfAllowedForMethod(body, method, requestType)
    } as RequestInit;
    const response = await fetch(RequestUtil._getUriWithQueryParams(uri, queryParams), request);
    if (!response.ok || response.status >= 400) {
      throw await HttpError.fromResponse(response);
    }
    const result = await responseProcessors[responseType](response);
    return result as T;
  };

  static _getBodyIfAllowedForMethod(body, method, requestType) {
    const methodIsNotGetOrHead = !(method === HttpMethod.GET || method === HttpMethod.HEAD);
    let resultBody = undefined;
    if (methodIsNotGetOrHead) {
      resultBody = body;
      if (requestType === HttpContentType.JSON) {
        resultBody = JSON.stringify(resultBody);
      }
    }
    return resultBody;
  }

  static _getUriWithQueryParams(uri, params) {
    const result = [uri];
    const stringifiedParams = stringify(params);
    stringifiedParams && (result.push(stringifiedParams));
    return result.join("?");
  }
}