import React from "react";
import {Col, Row} from "antd";
import {QuestionViewer} from "./QuestionViewer";

export const CollectSentencesFromWordsForm = ({
                                                questions = [],
                                                answer = {answers: []}
                                              }) => {
  const list = questions.map((question, questionIndex) => {
    const studentAnswer = answer?.answers && answer.answers[questionIndex];
    return (
      <Col xs={24}
           key={questionIndex} >
        <QuestionViewer answer={studentAnswer}
                        questionIndex={questionIndex}
                        sentence={question.sentence} />
      </Col>)
  });

  return (
    <Row gutter={[8, 8]} style={{marginBottom: 16}}>
      {list}
    </Row>
  );
}