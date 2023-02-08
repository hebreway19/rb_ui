import React, { createContext, useContext, useEffect, useRef } from "react";
import { useAuth } from "./AuthProvider";
import { RequestParams, RequestProviderState, SendRequest } from "../types";
import { RequestUtil } from "../util";

export const requestContext = createContext<RequestProviderState>({} as RequestProviderState);

export const useRequest = () => {
  return useContext(requestContext);
};

export const sendRequestFactory = (predefinedRequestParams: RequestParams | object): SendRequest => async <T extends any, >(requestParams: RequestParams) => RequestUtil.sendRequest<T>({...requestParams, ...predefinedRequestParams});

export const RequestProvider = ({children}) => {
  const {token} = useAuth();
  const sendRequestRef = useRef<SendRequest>(RequestUtil.sendRequest as SendRequest);

  useEffect(() => {
    sendRequestRef.current = sendRequestFactory({token});
  }, [token]);

  const values = {
    sendRequest: sendRequestRef.current
  };
  return (<requestContext.Provider value={values}>{children}</requestContext.Provider>);
};