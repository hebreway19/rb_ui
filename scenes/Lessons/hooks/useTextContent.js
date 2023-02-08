import { createContext, useContext } from "react";

export const textContentContext = createContext();

export const useTextContent = () => {
  return useContext(textContentContext);
}

 useTextContent;
