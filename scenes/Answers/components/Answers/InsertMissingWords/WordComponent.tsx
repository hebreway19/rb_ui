import React, {CSSProperties} from "react";
import {Typography} from "antd";

export const WordComponent = ({
                                words,
                                index,
                                answer,
                                word
                              }) => {
  const textStyle: CSSProperties = {
    margin: "auto 0px",
    display: "inline"
  }

  const enteredValue: string = (answer?.words && answer.words[index]) || "";
  const isCorrect: boolean = word.props.children && enteredValue.trim() === word.props.children.trim();
  let isLastCharacterSpecial: boolean = false;
  try {
    isLastCharacterSpecial = /[;.,:?"'!]/g.test(word.props.children && word.props.children[word.props.children.length - 1].trim());
  } catch (error) {
    console.error(error);
  }

  const noneIncludeWord = word.props.children === "<br/>" ? <br/> : word;
  const backgroundStyle = {
    backgroundColor: isCorrect ? "#1e9c73" : "#de9b16", lineHeight: "27px"
  }
  return (
    <span style={textStyle}>
      { words.includes(index)
        ? (
          <>&nbsp;
            <Typography.Text style={backgroundStyle}>{enteredValue.trim() || "____"}</Typography.Text>
            {isLastCharacterSpecial && word.props.children[word.props.children.trim().length - 1]}
          </>)
        : <> {noneIncludeWord} </>
      }
    </span>
  );
}