import React from "react";
import { sizeContext } from "../shared/hooks";

export const SizeProvider = ({children}) => {

  const values = {};
  return (
    <sizeContext.Provider value={values} children={children}/>
  );
};