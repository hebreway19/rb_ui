import { Col, Input, Row } from "antd";
import { Card } from "antd-mobile";
import React, { useCallback } from "react";
import { StringUtil } from "../../../../../util";
import { ComponentSize, StudentAnswerType } from "../../../../../constants";
import { HebTypography } from "../../../../../components/HebElements";
import { useFontFamily } from "../../../../../shared/hooks";

const fontSizeFactory: any = {
  [ComponentSize.SMALL.name]: {fontSize: 16},
  [ComponentSize.DEFAULT.name]: {fontSize: 20},
  [ComponentSize.LARGE.name]: {fontSize: 24}
}

const WordComponent = ({word, words, mode, answer = { words: [] }, index, setAnswer}) => {
  const {fontSize} = useFontFamily();
  const updateFieldAnswer = useCallback((wordIndexInText, value) => setAnswer(
    oldState => {
      let newAnswer = {
        ...oldState,
        words: oldState?.words || [],
        __t: StudentAnswerType.InsertMissingWordsAnswer
      };
      newAnswer.words[wordIndexInText] = value;
      return newAnswer;
    }), [setAnswer]);

  const enteredValue = (answer?.words && answer.words[index]) || "";
  let isLastCharacterSpecial = false
  try {
    isLastCharacterSpecial = /[;.,:?"'!]/g.test(word.props.children[word.props.children.length - 1]);
  } catch (error) {
    console.error(error);
  }
  return (
    <span key={index}
          style={{
            margin: "auto 0px",
            display: "inline"
          }}> { words.includes(index)
      ? mode === "view"
        ? <>
          <HebTypography.Text strong mark={!!enteredValue}>{enteredValue || "____"}</HebTypography.Text>
          {isLastCharacterSpecial && word.props.children[word.props.children.length - 1]}
        </>
        : <> <Input style={{
          width: "10rem",
          margin: 0,
          padding: 0,
          border: "none",
          background: "none",
          borderBottom: "2px solid #75ECF9",
          display: "inline",
          ...fontSizeFactory[fontSize],
        }}
                    lang="he"
                    dir="rtl"
                    className="input_hebrew-text"
                    onChange={e => updateFieldAnswer(index, e.target.value)}
                    value={enteredValue}/>
          {isLastCharacterSpecial && word.props.children[word.props.children.length - 1]}
        </>
      : word.props.children === "<br/>" ? <br/> : word
    } </span>
  );
};


export const StudentForm = ({
                              _id,
                              __t,
                              task = {content: []},
                              words = [],
                              mode,
                              setAnswer,
                              answer = {words: []}
                            }) => {

  const taskContents = task.content || [];

  const wordsList = taskContents.filter(taskContent => taskContent.isVisibleForStudents)
    .map((taskContent) => StringUtil.convertHtmlStringToStringArrayWithOutHtml(taskContent?.he_nikkudot || "")
      .map((word) => word === "<br/>" ? <br/> : <HebTypography.Text dir="rlt">{` ${word}`}</HebTypography.Text>))
    .reduce((acc, x) => acc.length ? [...acc, (<br/>), (<br/>), x] : [x], [])
    .flat()
    .map((word, index) => <WordComponent key={index}
                                         word={word}
                                         words={words}
                                         mode={mode}
                                         setAnswer={setAnswer}
                                         answer={answer}
                                         index={index}/>);

  const wordsBlock = (
    <HebTypography.Paragraph lang="he">
      {wordsList}
    </HebTypography.Paragraph>
  );

  return (
    <Card>
      <Row>
        <Col xs={24} style={{textAlign: "right"}} dir="rtl">
          {wordsBlock}
        </Col>
      </Row>
    </Card>
  );
};

export default StudentForm;