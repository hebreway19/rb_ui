import { Context, createContext, useContext } from "react";
import { FontFamily } from "../../types";

export const fontFamilyContext: Context<FontFamily> = createContext<FontFamily>({} as FontFamily);

export const useFontFamily = (): FontFamily => {
  return useContext(fontFamilyContext);
};