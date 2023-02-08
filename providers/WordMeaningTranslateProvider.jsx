import React, { useCallback, useState } from "react";
import { StorageKey } from "../constants";
import { wordMeaningTranslateContext } from "../shared/hooks";

export const WordMeaningTranslateProvider = ({children}) => {
  const [translate, setTranslate] = useState(process.browser && (window.localStorage.getItem(StorageKey.WORD_MEANING_LANGUAGE)
      || window.localStorage.getItem(StorageKey.I18NEXT))
    || "en");
  const updateTranslate = useCallback(async newTranslateValue => {
    setTranslate(newTranslateValue);
    localStorage.setItem(StorageKey.WORD_MEANING_LANGUAGE, newTranslateValue);
  }, []);
  const translateProps = {
    translate,
    updateTranslate
  }
  return (
    <wordMeaningTranslateContext.Provider value={translateProps}>
      {children}
    </wordMeaningTranslateContext.Provider>
  )
};