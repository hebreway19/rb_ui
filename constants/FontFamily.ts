import React from "react";

export namespace FontFamily {

  export type  FontFamilyType = {
    title: string;
    name: string;
    style: React.CSSProperties;
  }

  export const ARIAL: FontFamilyType = {
    title: "Arial",
    name: "arial",
    style: {fontFamily: "\"Arial\""}
  };

  export const CARDO: FontFamilyType = {
    title: "Cardo",
    name: "сardo",
    style: {fontFamily: "\"Cardo\", serif"}
  };

  export const TIMES_NEW_ROMAN: FontFamilyType = {
    title: "Times new roman",
    name: "times_new_roman",
    style: {fontFamily: "\"Times new roman\""}
  };

  export const DAVID_LIBRE: FontFamilyType = {
    title: "David Libre",
    name: "david_libre",
    style: {fontFamily: "\"David Libre\", serif"}
  };
}