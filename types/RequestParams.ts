import { CacheMode, HttpContentType, HttpMethod } from "../constants";

export type RequestParams = {
  method: HttpMethod;
  uri: string;
  credentials?: RequestCredentials;
  body?: any;
  additionalHeaders?: any;
  queryParams?: any;
  isAuthorized?: boolean;
  cacheMode?: CacheMode;
  requestType?: HttpContentType;
  responseType?: HttpContentType;
  token?: string;
};


