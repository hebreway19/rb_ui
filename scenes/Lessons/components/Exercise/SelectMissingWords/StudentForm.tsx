import React, { useCallback, useEffect, useState } from "react";
import { Col, Row } from "antd";
import { Card } from "antd-mobile";
import { ArrayUtil, StringUtil } from "../../../../../util";
import { ExerciseType, StudentAnswerType, UserRole } from "../../../../../constants";
import { WordComponent as TypographyWordComponent } from "../WordComponent";
import { HebSelect, HebTypography } from "../../../../../components/HebElements";

const WordComponent = ({word, index, words = [], answer = {words: []}, updateFieldAnswer, mode}) => {
  const [variants, setVariants] = useState([]);
  const isLastCharacterSpecial = /[;.,:?"'!]/g.test(word[word.length - 1]);
  const [enteredValue, setEnteredValue] = useState("");
  const wordItem = words.find(w => w.positionInText === index);

  const onChangeSelect = useCallback((value) => {
    updateFieldAnswer(index, value);
  },[index, updateFieldAnswer]);
  useEffect(() => {
    const foundWord = (answer?.words || []).find(answerContent => answerContent.positionInText === index)?.answer;
    setEnteredValue(foundWord);
  }, [answer]);
  useEffect(() => {
    if (wordItem) {
      const newWord = isLastCharacterSpecial ? word.repeat(1).substring(0, word.length - 1) : word;
      setVariants(ArrayUtil.shuffle([newWord, ...wordItem.wrongAnswers]));
    }
  }, [word]);
  const select = (
    <React.Fragment>
      <HebSelect lang="he"
                 style={{
                   border: "none",
                   borderBottom: "2px solid #75ECF9",
                   background: "none",
                   color: "#ffffff",
                   width: "10rem"
                 }}
                 bordered={false}
                 arrow={false}
                 className="input_hebrew-text"
                 value={enteredValue}
                 onChange={onChangeSelect}>
        {
          variants.map((variantValue, variantIndex) => (
            <HebSelect.Option lang="he" dir="rtl" key={variantIndex} value={variantValue}>{variantValue}</HebSelect.Option>))
        }
      </HebSelect>{isLastCharacterSpecial && word[word.length - 1]}
    </React.Fragment>
  );
  if (wordItem === undefined) {
    return word
  }
  if (mode === "view") {
    return <TypographyWordComponent role={UserRole.STUDENT} word={enteredValue || "______"} strong mark={enteredValue !== undefined} />
  }
  return select;
};


export const StudentForm = ({
                              _id,
                              __t = ExerciseType.SelectMissingWords,
                              task,
                              words = [],
                              mode,
                              setAnswer,
                              answer = { words: [] }
                            }) => {
  const updateFieldAnswer = useCallback((wordIndexInText, value) => setAnswer(oldState => {
    let newAnswer = {...oldState, words: oldState?.words || [], __t: StudentAnswerType.SelectMissingWordsAnswer};
    if (newAnswer.words.some(wordItem => wordItem.positionInText === wordIndexInText)) {
      newAnswer.words = newAnswer.words.map(wordItem => wordItem.positionInText === wordIndexInText
        ? {...wordItem, answer: value}
        : {...wordItem});
    } else {
      newAnswer.words.push({positionInText: wordIndexInText, answer: value});
    }
    return newAnswer;
  }), [setAnswer]);

  const taskContents = task?.content || [];
  const wordsList = taskContents.filter(taskContent => taskContent.isVisibleForStudents)
    .map((taskContent) => StringUtil.convertHtmlStringToStringArrayWithOutHtml(taskContent?.he_nikkudot || "")
      .map((word) => word === "<br/>" ? <br/> : word))
    .reduce((acc, x) => acc.length ? [...acc, (<br/>), (<br/>), x] : [x], [])
    .flat()
    .map((word, index) => <span key={index}> <WordComponent word={word}
                                                                                  words={words}
                                                                                  answer={answer}
                                                                                  mode={mode}
                                                                                  updateFieldAnswer={updateFieldAnswer}
                                                                                  index={index}/> </span>);

  const wordsBlock = (
    <HebTypography.Paragraph lang="he">
      {wordsList}
    </HebTypography.Paragraph>
  );

  return (
    <Card>
      <Row>
        <Col xs={24} style={{textAlign: "right"}}>
          {wordsBlock}
        </Col>
      </Row>
    </Card>
  )
}

export default StudentForm;