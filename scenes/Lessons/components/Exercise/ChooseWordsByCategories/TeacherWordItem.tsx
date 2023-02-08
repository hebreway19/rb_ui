import React from "react";
import { WordComponent } from "../WordComponent";
import { UserRole } from "../../../../../constants";

export const TeacherWordItem = ({word, onClick, categoryName, style, currentCategoryName}) => {
  let resultStyle = {
    whiteSpace: "nowrap",
    cursor: "pointer"
  };
  if (!!categoryName) {
    if (categoryName === currentCategoryName) {
      style.backgroundColor = "#ffe58fa3";
    } else {
      style.backgroundColor = "#bfbfbf30";
    }
  }
  if (style) {
    resultStyle = {...resultStyle, ...style};
  }

  return (
    <WordComponent word={word === "<br/>" ? <br/> : word}
                   role={UserRole.TEACHER}
                   onClick={onClick}
                   style={resultStyle} />
  );
};

 TeacherWordItem;