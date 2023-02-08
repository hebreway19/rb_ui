import React from "react";
import {Col, Row} from "antd";
import {useAuth} from "../../../../../providers/AuthProvider";
import {QuestionForm} from "./QuestionForm";

export const TrueFalseQuestionsForm = ({
                                         questions = [],
                                         answer = {answers: []}
                                       }) => {
  const {user} = useAuth();

  const list = questions.map((question, questionIndex) => {
    const isTrue = answer?.answers && answer.answers[questionIndex];
    return (
      <Col xs={24}
           key={questionIndex}>
        <QuestionForm isTrue={isTrue}
                      question={question}
                      questionIndex={questionIndex}
                      userRole={user.role}
                      correctAnswer={question?.isTrue} />
      </Col>
    );
  });

  return (
    <Row gutter={[8, 8]}>
      {list}
    </Row>
  );
}