import { message } from "antd";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useFootnoteService } from "../services";
import { useAuth } from "./AuthProvider";
import { UserRole } from "../constants";
import { Footnote, FootnoteList, Page } from "../types";

export const footnoteListContext = createContext<FootnoteList>({} as FootnoteList);
export const useFootnoteList = () => {
  return useContext(footnoteListContext);
};
export const FootnoteListProvider = ({children}) => {
  const {user} = useAuth();

  const [footnotePage, setFootnotePage] = useState<Page<Footnote>>({totalDocs: 0, docs: []} as Page<Footnote>);
  const [didLoaded, setDidLoaded] = useState<boolean>(true);
  const [isVisibleRecycleBinList, setIsVisibleRecycleBinList] = useState<boolean>(false);
  const [filteredInfo, setFilteredInfo] = useState<any>({});

  const footnoteService = useFootnoteService();

  const updateFileField = useCallback(async (id: string, fileId: string) => {
    await footnoteService.updateFootnote(id, {audio: fileId} as Footnote);
  }, []);

  const findFootnoteListByWord = useCallback(async (word: string) => {
    setDidLoaded(true);
    try {
      const newFootnotePage = word.trim().length > 0
                              ? await footnoteService.findFootnoteListByWord(word)
                              : await footnoteService.getFootnoteList({},
                                                                      {
                                                                        page: footnotePage.page,
                                                                        limit: 8
                                                                      });
      setFootnotePage(newFootnotePage);
    } catch (error) {
      console.error(error);
      message.warning((await error).message);
    }
    setDidLoaded(false);
  }, []);
  const findFootnoteListFromRecycleBin = useCallback(async (page: number = 0) => {
    setDidLoaded(true);
    try {
      const newFootnotePage: Page<Footnote> = await footnoteService.getFootnoteListFromRecycleBin({page, limit: 8});
      setFootnotePage(newFootnotePage);
    } catch (error) {
      console.error(error);
      message.warn(error.message);
    }
    setDidLoaded(false);
  }, []);
  const refreshFootnoteList = useCallback(async (page: number = 0) => {
    setDidLoaded(true);
    try {
      const newFootnotePage: Page<Footnote> = await footnoteService.getFootnoteList({}, {page: page, limit: 8});
      setFootnotePage(newFootnotePage);
    } catch (error) {
      console.error(error);
      message.warning(error.message);
    }
    setDidLoaded(false);
  }, []);
  useEffect(() => {
    user?.role !== UserRole.ENROLE && refreshFootnoteList();
  }, []);
  const values: FootnoteList = {
    footnotePage,
    didLoaded,
    isVisibleRecycleBinList,
    setIsVisibleRecycleBinList,
    filteredInfo,
    setFilteredInfo,
    findFootnoteListByWord,
    findFootnoteListFromRecycleBin,
    refreshFootnoteList,
    updateFileField
  };
  return (
    <footnoteListContext.Provider value={values}>
      {children}
    </footnoteListContext.Provider>
  );
};