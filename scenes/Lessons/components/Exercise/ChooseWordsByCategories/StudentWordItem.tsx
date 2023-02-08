import React from "react";
import { WordComponent } from "../WordComponent";
import { UserRole } from "../../../../../constants";

export const StudentWordItem = ({word, onClick, categoryName, currentCategoryName}) => {
  const style: React.CSSProperties = {
    whiteSpace: "nowrap",
    cursor: "pointer"//`url(${process.env.PUBLIC_URL + "/img/cur/marker.cur"}) 0 0, default`
  };
  if (!!categoryName) {
    if (categoryName === currentCategoryName) {
      style.backgroundColor = "#ffe58f";
    } else {
      style.backgroundColor = "#bfbfbf";
    }
  }
  return (
    <>
      <WordComponent role={UserRole.STUDENT} onClick={onClick} style={style} word={word}/>
    </>
  );
};