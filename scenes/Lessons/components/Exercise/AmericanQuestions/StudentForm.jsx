import { Badge, Card, Col, Row, Typography } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { ArrayUtil } from "../../../../../util";
import { ExerciseType } from "../../../../../constants";
import { HebButton, HebCard, HebSteps } from "../../../../../components/HebElements";
import { useLessonForm } from "../../../../../providers";

export const QuestionForm = ({
                               _id,
                               __t = ExerciseType.AmericanQuestions,
                               mode,
                               answer = {},
                               question,
                               correctAnswer,
                               wrongAnswers = [],
                               updateAnswer
                             }) => {
  const { t } = useTranslation();

  const [answerList, setAnswersList] = useState([]);
  useEffect(() => {
    const unshuffledAnswersList = [...(wrongAnswers || []), correctAnswer];
    setAnswersList(mode !== "view"
                     ? ArrayUtil.shuffle(unshuffledAnswersList)
                     : unshuffledAnswersList);
  }, [wrongAnswers, correctAnswer, mode]);

  const cardTitle = t(`pages.lesson.form.tasks.exercises.types.${__t}.title`);
  const studentCardGridTitle = t("pages.answer.student_answers.single");
  const correctCardGridTitle = t("pages.answer.correct.single");

  const getAnswerContentBlock = (answerContent) => (
    <div style={{ padding: "2.125rem 1.5rem .875rem 1.5rem" }}
         lang="he"
         dir="rtl">
      {answerContent?.he_nikkudot || answerContent?.he}
    </div>
  );
  const getCorrectStudentAnswerComponent = (answerContent) => (
    <Badge.Ribbon text={correctCardGridTitle}
                  placement="end">
      <Badge.Ribbon text={studentCardGridTitle}
                    placement="start"
                    color={"#1e9c73"} >
        {getAnswerContentBlock(answerContent)}
      </Badge.Ribbon>
    </Badge.Ribbon>
  );
  const getCorrectTeacherAnswerComponent = (answerContent) => (
    <Badge.Ribbon text={correctCardGridTitle}
                  placement="end" >
      {getAnswerContentBlock(answerContent)}
    </Badge.Ribbon>
  );
  const getWrongStudentAnswerComponent = (answerContent) => (
    <Badge.Ribbon text={studentCardGridTitle}
                  placement="start"
                  color={"#de9b16"} >
      {getAnswerContentBlock(answerContent)}
    </Badge.Ribbon>
  );
  const checkCorrectAndReturnResult = (correctAnswerHeNikkudot, studentAnswerHeNikkudot, currentAnswerHeNikkudot) => {
    let result = getAnswerContentBlock;
    if (currentAnswerHeNikkudot === correctAnswerHeNikkudot) {
      result = getCorrectTeacherAnswerComponent;
      if (currentAnswerHeNikkudot === studentAnswerHeNikkudot) {
        result = getCorrectStudentAnswerComponent;
      }
    }
    if (currentAnswerHeNikkudot === studentAnswerHeNikkudot) {
      result = getWrongStudentAnswerComponent;
    }
    return result;
  }
  const viewCardGrid = (answerContent, answerIndex) => (
    <Card.Grid hoverable={false}
               style={{
                 width: "100%",
                 padding: 0,
                 background: "none !important",
                 textAlign: "right"
               }}>
      {checkCorrectAndReturnResult(correctAnswer?.he_nikkudot, answer?.he_nikkudot, answerContent?.he_nikkudot)(answerContent)}
    </Card.Grid>)
  const defaultCardGrid = (answerContent, answerIndex) => (
    <Card.Grid style={{
      width: "100%",
      padding: 0,
      background: "unset",
      border: "1px solid #75ECF9"
    }}>
      <HebButton onClick={() => updateAnswer(answerContent)}
              dir="rlt"
              lang="he"
              disabled={mode === "view"}
              block
              style={{
                height: "100%",
                textAlign: "right",
                padding: 24,
              }}
              viewType={answer?.he_nikkudot === answerContent?.he_nikkudot
                ? "primary"
                : "text"}>
        {answerContent?.he_nikkudot}
      </HebButton>
    </Card.Grid>);
  return (
    <HebCard bordered={false}
          title={
            <>
              <Row hidden={mode === "view"}>
                <Col xs={24}>
                  <Typography.Title level={4}>
                    {cardTitle}
                  </Typography.Title>
                </Col>
              </Row>
              <Row dir="rtl">
                <Col xs={24}>
                  <Typography.Title level={5}
                                    dir="rtl"
                                    lang="he"
                                    style={{ textAlign: "right" }}>
                    {question?.he_nikkudot || question?.he || "he_nikkudot"}
                  </Typography.Title>
                </Col>
              </Row>
            </>
          }>
      {answerList.map((answerContent, answerIndex) => (
        <React.Fragment key={answerIndex}>
          {
            mode === "view"
              ? (viewCardGrid(answerContent, answerIndex))
              : (defaultCardGrid(answerContent, answerIndex))
          }
        </React.Fragment>))
      }
    </HebCard>
  )
};

export const StudentForm = ({
                              _id,
                              __t = ExerciseType.AmericanQuestions,
                              taskIndex,
                              questions = [],
                              answer = { answers: [] },
                              commitAnswer,
                              mode,
                              ...props
                            }) => {
  const { getExerciseIndexByTaskIndexAndExerciseType } = useLessonForm();
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  const exerciseIndex = getExerciseIndexByTaskIndexAndExerciseType(taskIndex,
                                                                   __t);
  const updateAnswer = useCallback((questionIndex) => async (isTrue) => {
    const newAnswers = (answer?.answers || []);
    newAnswers[questionIndex] = isTrue;
    await commitAnswer(_id, {
      ...answer,
      __t: "AmericanQuestionsAnswer",
      answers: newAnswers
    });
  }, [commitAnswer, answer, _id]);

  const list = questions.map((question, questionIndex) => {
    const studentAnswer = answer?.answers && answer.answers[questionIndex];
    return (<QuestionForm key={questionIndex}
                          taskIndex={taskIndex}
                          mode={mode}
                          answer={studentAnswer}
                          question={question?.question}
                          {...question}
                          updateAnswer={updateAnswer(questionIndex)}
                          questionIndex={questionIndex}
                          exerciseIndex={exerciseIndex}
    />)
  });
  return (
    <>
      <Row gutter={16}>
        <Col xs={mode !== "view" ? 21 : 24}>
          <Row gutter={[8, 8]}>
            {list.map((questionForm, questionIndex) => (
              <Col xs={24}
                   key={questionIndex}
                   hidden={questionIndex !== selectedQuestion && mode !== "view"}>
                {questionForm}
              </Col>
            ))
            }
          </Row>
        </Col>
        <Col xs={3}
             hidden={mode === "view"}>
          <HebSteps direction="vertical"
                 type="navigation"
                 current={selectedQuestion}
                 onChange={setSelectedQuestion}>
            {
              list.map((questionForm, questionIndex) => (
                <HebSteps.Step status={selectedQuestion === questionIndex ? "process" : "finish"} key={questionIndex}/>
              ))
            }
          </HebSteps>
        </Col>
      </Row>
    </>
  );
}
