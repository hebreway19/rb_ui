import React, {useEffect} from "react";
import {Col, Row} from "antd";
import {QuestionForm} from "./QuestionForm";
import {AmericanQuestion, AmericanQuestionsAnswer} from "../../../../../types";

export const AnswerAmericanQuestionsForm = ({questions, answer}) => {
  const list = questions.map((questionItem: AmericanQuestion, questionIndex: number) => {
    const studentAnswer: AmericanQuestionsAnswer = answer?.answers && answer.answers[questionIndex];
    return (
      <Col xs={24}
           key={questionIndex}>
        <QuestionForm answer={studentAnswer}
                      question={questionItem.question}
                      wrongAnswers={questionItem.wrongAnswers}
                      correctAnswer={questionItem.correctAnswer}/>
      </Col>
    )
  });

  return (
    <Row gutter={[8, 8]}>
      {list}
    </Row>
  );
}