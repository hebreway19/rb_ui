import React from "react";
import { appWithTranslation } from "next-i18next";
import "antd/dist/antd.css";
import { AppProps } from "next/app";
import Script from "next/script";

import { AuthProvider, FontFamilyProvider, LanguageProvider, NavigatorProvider, RequestProvider, WordMeaningTranslateProvider } from "../providers";
import { StorageKey } from "../constants";

import "./index.scss";

const MyApp = ({Component, pageProps}: AppProps) => {
  return (
    <>
      <Script strategy="beforeInteractive" type="text/javascript" src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"/>
      <FontFamilyProvider>
        <NavigatorProvider>
          <AuthProvider jwt={pageProps[StorageKey.JWT]}>
              <RequestProvider>
                <WordMeaningTranslateProvider>
                  <LanguageProvider>
                    <Component {...pageProps}/>
                  </LanguageProvider>
                </WordMeaningTranslateProvider>
              </RequestProvider>
          </AuthProvider>
        </NavigatorProvider>
      </FontFamilyProvider>
    </>
  );
};

export default appWithTranslation(MyApp);