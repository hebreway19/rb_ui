import React from "react";
import {ViewQuestionForm} from "./QuestionForm";
import {Col, Row} from "antd";

export const SupplementSentencesForm = ({
                                          questions = [],
                                          answer = { answers: []}
                                        }) => {
  const list = questions.map((question, questionIndex) => {
    const currentAnswer = answer?.answers && answer.answers[questionIndex];
    return (
      <React.Fragment key={questionIndex}>
        <ViewQuestionForm answer={currentAnswer}
                          questionIndex={questionIndex}
                          isStart={question.isStart}
                          sentence={question.sentence} />
      </React.Fragment>
    )
  });

  return (
    <Row gutter={[8, 8]}>
      {list.map((questionForm, questionIndex) => (
        <Col xs={24}
             key={questionIndex}>
          {questionForm}
        </Col>
      ))}
    </Row>
  )
}