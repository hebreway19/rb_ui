import React, { useEffect, useState } from "react";
import { WordComponent as TypographyWordComponent } from "../WordComponent";
import { UserRole } from "../../../../../constants";

export const WordComponent = ({
                                word,
                                index,
                                words = [],
                                answer = {words: []}
                              }) => {
  const [enteredValue, setEnteredValue] = useState<string>("");

  const wordItem = words.find(w => w.positionInText === index);

  useEffect(() => {
    const foundWord = (answer?.words || []).find(answerContent => answerContent.positionInText === index)?.answer;
    setEnteredValue(foundWord);
  }, [answer]);

  if (wordItem === undefined) {
    return word?.type === "br" ? <br /> : word
  }
  return <TypographyWordComponent role={UserRole.TEACHER}
                                  word={enteredValue || "______"}
                                  strong
                                  style={{
                                    backgroundColor: word === enteredValue ? "#1e9c73" : "#de9b16"
                                  }} />
}