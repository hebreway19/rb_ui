import React from "react";
import {Footnote, Page} from ".";

export type FootnoteList = {
  footnotePage: Page<Footnote>;
  isVisibleRecycleBinList: boolean;
  didLoaded: boolean;
  filteredInfo: any;
  setIsVisibleRecycleBinList: React.Dispatch<React.SetStateAction<boolean>>,
  setFilteredInfo: React.Dispatch<React.SetStateAction<any>>;
  findFootnoteListByWord(word: string): Promise<void>;
  findFootnoteListFromRecycleBin(page?: number): Promise<void>;
  refreshFootnoteList(page?: number): Promise<void>;
  updateFileField;
};

