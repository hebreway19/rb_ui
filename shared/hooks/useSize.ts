import { createContext, useContext } from "react";

export const sizeContext = createContext({});

export const useSize = () => useContext(sizeContext);