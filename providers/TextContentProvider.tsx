import React from "react";
import { textContentContext } from "../scenes/Lessons/hooks";

export const TextContentProvider = ({children,...props}) => {
  const value = {};
  return (
    <textContentContext.Provider value={value}>
      {children}
    </textContentContext.Provider>
  );
}