import React, { useCallback, useEffect, useState } from "react";
import { ComponentSize, FontFamily, StorageKey } from "../constants";
import { fontFamilyContext } from "../shared/hooks";

const fontFamilyStyles = {
  arial: FontFamily.ARIAL.style,
  cardo: FontFamily.CARDO.style,
  times_new_roman: FontFamily.TIMES_NEW_ROMAN.style,
  david_libre: FontFamily.DAVID_LIBRE.style,
}

export const FontFamilyProvider = ({children}) => {
  const [fontFamily, setFontFamily] = useState<string>();
  const [fontSize, setFontSize] = useState<string>();
  const [fontFamilyStyle, setFontFamilyStyle] = useState()
  
  const changeFontFamily = useCallback(async (fontFamilyName) => {
    setFontFamily(fontFamilyName);
  }, []);
  const changeFontSize = useCallback(async (fontSizeValue) => {
    setFontSize(fontSizeValue);
  }, []);
  
  useEffect(() => {
    let initialFontSize: string = ComponentSize.DEFAULT.name;
    let initialFontFamily: string = FontFamily.ARIAL.name;
    const localStorageComponentSize: string = window.localStorage.getItem(StorageKey.COMPONENT_SIZE);
    const localStorageFontFamily: string = window.localStorage.getItem(StorageKey.FONT_FAMILY);
    if (localStorageComponentSize !== undefined && localStorageComponentSize !== 'undefined') {
      initialFontSize = localStorageComponentSize;
    }
    if (localStorageFontFamily !== undefined && localStorageFontFamily !== 'undefined' &&
        localStorageFontFamily !== null && localStorageFontFamily !== 'null') {
      initialFontFamily = localStorageFontFamily;
    }
    setFontSize(initialFontSize);
    setFontFamily(initialFontFamily);
  }, []);
  
  useEffect(() => {
    localStorage.setItem(StorageKey.COMPONENT_SIZE, fontSize);
  }, [fontSize]);
  
  useEffect(() => {
    localStorage.setItem(StorageKey.FONT_FAMILY, fontFamily);
  }, [fontFamily]);
  
  useEffect(() => {
    setFontFamilyStyle(fontFamilyStyles[fontFamily]);
  }, [fontFamily]);
  
  const fontFamilyValues = {
    fontFamily,
    fontSize,
    fontFamilyStyle,
    changeFontFamily,
    changeFontSize
  }
  
  return (
    <fontFamilyContext.Provider value={fontFamilyValues}>
      <div className={`font-size__${fontSize} font-family__${fontFamily}`}>
        {children}
      </div>
    </fontFamilyContext.Provider>
  )
};