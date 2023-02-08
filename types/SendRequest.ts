import { RequestParams } from "./RequestParams";

export type SendRequest = <T = any> (requestParams: RequestParams) => Promise<T>;