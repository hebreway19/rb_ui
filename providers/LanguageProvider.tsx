import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import Router from "next/router";
import { useTranslation } from "next-i18next";

import { User } from "../types";
import { useAuth } from "./AuthProvider";
import { LanguageCode } from "../constants";

type LanguageContext = {
  language: LanguageCode;
  updateLanguage: (language: LanguageCode) => void | Promise<void>;
};

export const languageContext = createContext<LanguageContext>({} as LanguageContext);

export const useLanguage = (): LanguageContext => {
  return useContext(languageContext);
};

export const LanguageProvider = ({children}) => {
  const {user, updateCurrentAuthorizedUser} = useAuth();

  const translation = useTranslation();
  const [language, setLanguage] = useState(user?.interfaceLanguage || translation.i18n.language);

  const updateLanguage = useCallback(async (newLanguage) => {
    try {
      const newUserInfo: any = {interfaceLanguage: newLanguage};
      if (user) {
        await updateCurrentAuthorizedUser(newUserInfo as User);
      }
      setLanguage(newLanguage);
    }
    catch (error) {
      console.error(error);
    }
  }, [user, updateCurrentAuthorizedUser]);

  useEffect(() => {
    if (language && Router.isReady) {
      Router.push(Router.pathname, Router.asPath, {locale: String(language)});
    }
  }, [language]);

  const languageProps = {language, updateLanguage};

  return (
    <languageContext.Provider value={languageProps}>
      {children}
    </languageContext.Provider>
  );
};