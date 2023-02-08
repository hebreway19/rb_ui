import React from "react";
import { HebTypography } from "../../../../../components/HebElements/HebTypography";

export const WordComponent = ({word = "", style = {}, ...props}) => {
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
    ...props
  }

  const wordItem = (
    <span style={{color: "#000000"}}>
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