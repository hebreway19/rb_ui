import { createContext, useContext } from "react";

export const wordMeaningTranslateContext = createContext();

export const useWordMeaningTranslate = () => {
  return useContext(wordMeaningTranslateContext);
}