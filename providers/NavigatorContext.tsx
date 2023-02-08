import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { message } from "antd";
import { useTranslation } from "next-i18next";

type NavigatorContext = {
  navigator: Navigator;
  share: (url: string) => Promise<void> | void;
};
export const navigatorContext = createContext<NavigatorContext>({} as NavigatorContext);
export const useNavigator = (): NavigatorContext => {
  return useContext(navigatorContext);
};

export const NavigatorProvider = ({children}) => {
  const {t} = useTranslation();
  const navigatorRef = useRef<Navigator>();

  const share = useCallback(async (url) => {
    try {
      if (navigatorRef.current?.share) {
        const shareData = {
          url
        };
        await navigatorRef.current?.share(shareData);
        message.success(t("messages.lesson_link_shared"));
      } else {
        await navigatorRef.current?.clipboard.writeText(url);
        message.success(t("messages.lesson_link_for_students_copied"));
      }
    }
    catch (error) {
      console.error(error);
      message.warning(error.message);
    }
  }, [t]);

  useEffect(() => {
    if (process.browser && (navigator || window?.navigator)) {
      navigatorRef.current = (navigator || window?.navigator);
    }
    return () => {
      navigatorRef.current = null;
    };
  });

  const value = {
    navigator: navigatorRef.current,
    share
  };

  return (
    <navigatorContext.Provider value={value}>
      {children}
    </navigatorContext.Provider>
  );
};
