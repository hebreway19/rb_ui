import React from "react";
import { UserRole } from "../../../../../constants";
import {HebTypography} from "../../../../../components/HebElements/HebTypography";

type WordComponentProps = {
  [key: string]: any;
  word: string;
  style?: React.CSSProperties | any;
  role: UserRole;
  onClick?: any;
}

export const WordComponent = ({word = "", onClick = () => {}, style, role, ...props}: WordComponentProps) => {
  const specialCharacterRegex = /[.,;:?"'!]/g;
  let displayedWord;

  const isFirstCharacterSpecial = specialCharacterRegex.test(word[0]);
  let isSpecialCharacters = [];
  let copyPoints = {start: 0, finish: word.length}
  if (isFirstCharacterSpecial) {
    copyPoints.start = 1;
  }
  if (word.length > 0) {
    isSpecialCharacters = word.split("")
      .map((character, index) => {
        if (index === 0) {
          return false;
        }
        return specialCharacterRegex.test(character) ? true
          : character === ",";
      });
    copyPoints.finish = isSpecialCharacters.length - (isSpecialCharacters.slice().reverse().indexOf(false));
  }

  displayedWord = {
    first: (isFirstCharacterSpecial && word[0]) || "",
    main: word.length > 0 ? word.substring(copyPoints.start, copyPoints.finish)
      : word,
    last: word.length > 0 ? word.substring(copyPoints.finish)
      : ""
  };
  const textProps = {
    ...props,
    ...(onClick && ({onClick: onClick}))
  }

  const wordItem = (
    <span style={{color: role === UserRole.TEACHER ? "#ffffff" : "#000000"}}>
      {displayedWord.first}
      <HebTypography.Text style={style} {...textProps}>
        {displayedWord?.main}
      </HebTypography.Text>
      {displayedWord?.last}
      <> </>
    </span>
  )
  return (word === '<br/>' ? <br/> : wordItem);
}