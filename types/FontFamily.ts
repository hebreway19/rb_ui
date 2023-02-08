import React from "react";
import { FontFamily as FormFamilyNamespace } from "../constants";

export type FontFamily = {
  fontFamilyStyle: React.CSSProperties,
  fontFamily: string;
  fontSize: string;
  changeFontSize(fontSizeValue: string);
  changeFontFamily(fontFamily: FormFamilyNamespace.FontFamilyType);
};