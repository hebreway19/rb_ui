import React, { useCallback, useState } from "react";
import { Col, Row, Typography } from "antd";
import { HebForm, HebSteps, HebTextArea, HebTypography } from "../../../../../components/HebElements";
import { useTranslation } from "next-i18next";
import { StudentAnswerType } from "../../../../../constants";
import { LocalizedContent, TextQuestionAnswer } from "../../../../../types";
import { StringUtil } from "../../../../../util";

class ExerciseItemFromProps {
  question: LocalizedContent;
  questionIndex: number;
  studentAnswer: LocalizedContent;
  answer: TextQuestionAnswer;
  setAnswer: any;
}

const ExerciseItemForm = ({
                            question,
                            questionIndex,
                            studentAnswer = {he_nikkudot: "", he: ""},
                            answer,
                            setAnswer
                          }: ExerciseItemFromProps) => {
  const {t} = useTranslation();

  const questionItemLabel = t("pages.lesson.form.tasks.exercises.questions.item_label");

  const updateAnswerText = useCallback(({target: {value}}) => {
    let answers = answer?.answers || [];
    answers[questionIndex] = {he_nikkudot: value, he: StringUtil.removeNikkudots(value)};
    setAnswer({...answer, answers: answers, _id: answer._id, id: answer.id, __t: StudentAnswerType.TextQuestions});
  }, []);
  return (
    <Row gutter={[0, 16]}>
      <Col xs={24}>
        <HebTypography.Text style={{marginRight: 24, marginLeft: 24}}>
          {questionItemLabel}{questionIndex + 1}
        </HebTypography.Text>
      </Col>
      <Col xs={24} dir={"rtl"}>
        <HebTypography.Text dir={"rtl"}
                            lang={"he"}
                            style={{marginRight: 24, marginLeft: 24}}
        >
          {question.he_nikkudot || question.he}
        </HebTypography.Text>
      </Col>
      <Col xs={24}>
        <HebForm.Item initialValue={studentAnswer}
                      value={studentAnswer}
                      rules={[
                        {required: true}
                      ]}
        >
          <HebTextArea dir={"rtl"}
                       onChange={updateAnswerText}
                       value={studentAnswer?.he_nikkudot || ""}
                       lang={"he"} />
        </HebForm.Item>
      </Col>
    </Row>
  )
}

class ExerciseFormProps {
  questions: LocalizedContent[];
  answer: TextQuestionAnswer;
  setAnswer: any;
}

const ExerciseForm = ({
                        questions = [],
                        answer = { answers: [] },
                        setAnswer
                      }: ExerciseFormProps) => {
  const {t} = useTranslation();

  const [selectedQuestion, setSelectedQuestion] = useState(0);

  const titleLabel = t(`pages.lesson.form.tasks.exercises.types.TextQuestionsExercise.title`);

  const questionList = questions.map((question, questionIndex) => (
    <React.Fragment key={questionIndex}>
      <ExerciseItemForm question={question}
                        questionIndex={questionIndex}
                        setAnswer={setAnswer}
                        answer={answer}
                        studentAnswer={answer?.answers?.[questionIndex]}/>
    </React.Fragment>
  ))
  return (
    <Row>
      <Col xs={24}>
        <Typography.Paragraph style={{marginRight: 24, marginLeft: 24}}>
          {titleLabel}
        </Typography.Paragraph>
      </Col>
      <Col xs={24}>
        <Row>
          {questionList.length && questionList.map((content, contentIndex: number) => (
            <Col xs={21} key={contentIndex} hidden={contentIndex !== selectedQuestion}>
              {content}
            </Col>
          ))}
          <Col xs={3}>
            <HebSteps direction="vertical"
                      type="navigation"
                      current={selectedQuestion}
                      onChange={setSelectedQuestion}>
              {
                questionList.map((_, questionIndex: number) => (
                  <HebSteps.Step status={selectedQuestion === questionIndex ? "process" : "finish"} key={questionIndex}/>
                ))
              }
            </HebSteps>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export const StudentForm = (props: any) => {
  const Component = <ExerciseForm {...props} />;
  return (<>{!!Component && Component}</>);
}