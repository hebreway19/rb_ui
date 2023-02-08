import React, { createContext, useCallback, useContext, useState } from "react";

type ShowFields = {
  isShowFields: boolean;
  updateIsShowFields: React.Dispatch<React.SetStateAction<boolean>>;
}

export const showFieldsContext = createContext({} as ShowFields);
export const useShowFields = () => {
  return useContext(showFieldsContext);
};

export const ShowFieldsProvider = ({children}) => {
  const [isShowFields, setIsShowFields] = useState(false);
  const updateIsShowFields = useCallback(async (value) => setIsShowFields(value), []);
  const properties: ShowFields = {
    isShowFields,
    updateIsShowFields
  };
  return (
    <showFieldsContext.Provider value={properties}>
      {children}
    </showFieldsContext.Provider>
  );
};