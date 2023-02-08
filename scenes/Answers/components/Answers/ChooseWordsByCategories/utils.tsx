import {StringUtil} from "../../../../../util";
import React from "react";

export const getWordsWithBr = (paragraphs) => {
  return paragraphs.map((taskContent) => StringUtil.convertHtmlStringToStringArrayWithOutHtml(taskContent?.he_nikkudot || ""))
                   .reduce((acc, x) => acc.length ? [...acc, (<br/>), (<br/>), x] : [x],
                           [])
                   .flat()
                   .map(word => word === "<br/>" ? <br/> : word);
}

export const setCategory = (categories) => {
  if (Object.keys(categories)) {
    return Object.keys(categories)[0]
  }
  return ""
}