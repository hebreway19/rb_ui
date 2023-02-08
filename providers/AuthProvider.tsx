import React, { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import { message } from "antd";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";

import { useAuthenticationService, useUsersService } from "../services";
import { RoutePath, StorageKey } from "../constants";
import { Auth, AuthUser, Session, User } from "../types";
import { sendRequestFactory } from "./RequestProvider";


export const authContext = createContext<Auth>({} as Auth);
export const useAuth = (): Auth => {
  return useContext(authContext);
};

export const AuthProvider = ({children, jwt}) => {
  const {t} = useTranslation();
  const [browserCookies, setBrowserCookie, removeBrowserCookie] = useCookies([StorageKey.JWT]);
  const token = jwt || browserCookies[StorageKey.JWT];


  const usersService = useUsersService(sendRequestFactory({token}));
  const authenticationService = useAuthenticationService(sendRequestFactory({token}));
  const userRef = useRef<AuthUser>(token && jwtDecode(token));
  const tokenRefreshTimeoutRef = useRef<NodeJS.Timeout>();

  const router = useRouter();

  const setToken = useCallback((newToken) => {
    const decodedToken: AuthUser = jwtDecode(newToken);
    setBrowserCookie(StorageKey.JWT, newToken, {expires: new Date(decodedToken.expiresAt), path: "/", httpOnly: false});
    userRef.current = decodedToken;
  }, [setBrowserCookie])

  const goToPreviousPageOrToProfile = useCallback(async () => {
    if (process.browser && window.history.length > 1 && window.history[window.history.length - 2] &&
        window.history[window.history.length - 2].indexOf(window.location.host) !== -1) {
      router.back();
    } else {
      await router.push(RoutePath.PROFILE());
    }
  }, [router]);

  const refreshToken = useCallback(async () => {
    console.log("refresh token...");
    if (userRef.current && token) {
      try {
        const newToken = await authenticationService.refreshToken();
        tokenRefreshTimeoutRef.current = null;
        setToken(newToken);
      }
      catch (error) {
        console.error(error);
        userRef.current = null;
        removeBrowserCookie(StorageKey.JWT);
        removeBrowserCookie(StorageKey.JWT, {path: "*"});
        removeBrowserCookie(StorageKey.JWT, {path: "/"});
      }
    }
  }, [authenticationService, token, removeBrowserCookie, setToken]);

  const signInBySessionId = useCallback(async (sessionId: string) => {
    console.log("sign by session...");
    try {
      const session: Session = await authenticationService.authorizeWithSession(sessionId);
      setToken(session.token);
      await router.push(RoutePath.PROFILE());
    }
    catch (error) {
      console.error(error);
      userRef.current = null;
      removeBrowserCookie(StorageKey.JWT);
      removeBrowserCookie(StorageKey.JWT, {path: "*"});
      removeBrowserCookie(StorageKey.JWT, {path: "/"});
    }
  }, [router, token, authenticationService, removeBrowserCookie, setToken]);

  const signInByUsernameAndPassword = useCallback(async (email, password) => {
    try {
      const newToken = await authenticationService.authorizeLocal({email, password});
      setToken(newToken);
      await goToPreviousPageOrToProfile();
    }
    catch (error) {
      console.error(error);
      message.warning(t("incorrect_username_or_password"));
      userRef.current = null;
    }
  }, [authenticationService, t, goToPreviousPageOrToProfile, setToken]);

  const resendConfirmationLink = useCallback(async () => {
    try {
      await authenticationService.resendConfirmationLink();
    }
    catch (error) {
      console.error(error);
      userRef.current = null;
    }
  }, [authenticationService])

  const updateCurrentAuthorizedUser = useCallback(async (updatedUser: User) => {
    try {
      await usersService.updateCurrentAuthorizedUser(updatedUser);
      await refreshToken();
      router.push(RoutePath.PROFILE());
    }
    catch (error) {
      console.error(error);
      message.warn(error.message);
    }
  }, [router, refreshToken, usersService]);

  const signOut = useCallback(async () => {
    try {
      removeBrowserCookie(StorageKey.JWT);
      removeBrowserCookie(StorageKey.JWT, {path: "*"});
      removeBrowserCookie(StorageKey.JWT, {path: "/"});
      userRef.current = null;
    } catch (error) {
      console.error(error);
      userRef.current = null;
    } finally {
      router.reload();
    }
  }, [router, removeBrowserCookie]);

  useEffect(() => {
    if (token) {
      if (browserCookies[StorageKey.JWT] !== token) {
        setToken(token);
      }
    }
  }, [token, browserCookies, setToken]);


  useEffect(() => {
    if (userRef.current && !tokenRefreshTimeoutRef.current) {
      tokenRefreshTimeoutRef.current = setTimeout(() => {
        refreshToken();
      }, 3600000);
    }
    return () => {
      if (tokenRefreshTimeoutRef.current) {
        clearTimeout(tokenRefreshTimeoutRef.current);
      }
    };
  }, [refreshToken]);

  const auth: Auth = {
    user: userRef.current,
    refreshToken,
    signInBySessionId,
    signInByUsernameAndPassword,
    resendConfirmationLink,
    updateCurrentAuthorizedUser,
    token,
    signOut,
    setToken
  };
  return (<authContext.Provider value={auth}>{children}</authContext.Provider>);
};