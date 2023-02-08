import React from "react";
import {Col, Divider, Row, Space} from "antd";
import {LocalizedContent, TextQuestionAnswer} from "../../../../../types";
import {ViewItemForm} from "./ViewItemForm";

class TextQuestionsFormProps {
  questions: LocalizedContent[];
  answer: TextQuestionAnswer;
}

export const TextQuestionsForm = ({
                    questions = [],
                    answer
                  }: TextQuestionsFormProps) => {
  const questionList = questions.map((question, questionIndex) => (
    <React.Fragment key={questionIndex}>
      <ViewItemForm question={question}
                    questionIndex={questionIndex}
                    studentAnswer={answer?.answers?.[questionIndex] || {he_nikkudot: ""}}/>
    </React.Fragment>
  ))
  return (
    <Row>
      <Col xs={24}>
        <Space direction="vertical"
               style={{width: "100%"}}
               split={<Divider />}
        >
          {questionList.length && questionList}
        </Space>
      </Col>
    </Row>
  );
}