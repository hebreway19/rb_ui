import { Col, Divider, Row, Typography } from "antd";
import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { ExerciseType, StudentAnswerType } from "../../../../../constants";
import { HebInput } from "../../../../../components/HebElements";

export const QuestionForm = ({
  sentence,
  answer,
  questionIndex,
  isStart = true,
  updateAnswer,
  ...props
}) => {
  const {t} = useTranslation();
  const typeSentience = t(`pages.lesson.form.tasks.exercises.isStart.sentence.student.long.${isStart}`);

  return (
    <>
      <Row>
        <Col xs={24}>
          <Typography.Title style={{textAlign: "right"}} level={5}>
            {typeSentience}
          </Typography.Title>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col xs={24}>
          <Typography.Paragraph dir="rtl"
                                lang="he"
                                style={{marginBottom: 0, textAlign: "right"}}>
              {isStart && (` ${sentence?.he_nikkudot || sentence?.he || ""} `)}
              <HebInput lang="he"
                        cssType="primary"
                        dir="rtl"
                        size="large"
                        className="input_hebrew-text"
                        style={{
                          width: "70%",
                          margin: 0,
                          padding: 0,
                          border: "none",
                          borderBottom: "2px solid #8a8a8a50",
                          display: "inline"
                        }}
                        value={answer}
                        onChange={e => updateAnswer(e.target.value)} />
              {!isStart && (` ${sentence?.he_nikkudot || sentence?.he || ""} `)}
          </Typography.Paragraph>
        </Col>
      </Row>
      <Divider />
    </>
  );
}

export const ViewQuestionForm = ({sentence,
  answer,
  questionIndex,
  isStart = true,
  ...props
}) => {
  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={22}>
          <Typography.Paragraph dir="rtl"
                                style={{marginBottom: 0, textAlign: "right"}}>
            <Typography.Text hidden={isStart}
                             mark 
                             bold
                             lang="he">
              {answer || ""}
            </Typography.Text>
            <Typography.Text lang="he">
              {` ${sentence?.he_nikkudot || sentence?.he || ""} `}
            </Typography.Text>
            <Typography.Text hidden={!isStart}
                             mark 
                             bold
                             lang="he">
              {answer || ""}
            </Typography.Text>
          </Typography.Paragraph>
        </Col>
        <Col xs={2}>
          <Typography.Paragraph>
            <Typography.Text bold
                             lang="he">
              .{questionIndex + 1}
            </Typography.Text>
          </Typography.Paragraph>
        </Col>
      </Row>
      <Divider />
    </>
  )
}

export const StudentForm = ({
  _id,
  __t = ExerciseType.SupplementSentences,
  questions = [],
  taskIndex,
  exerciseIndex,
  isStart = true,
  answer = { answers: []},
  setAnswer,
  mode,
  ...props
}) => {
  const {t} = useTranslation()

  const updateAnswer = useCallback((questionIndex) => async (newAnswerValue) => {
    setAnswer(oldState => {
      let newAnswer = {...oldState, answers: oldState?.answers || [], __t: StudentAnswerType.SupplementSentencesAnswer};
      newAnswer.answers[questionIndex] = newAnswerValue
      return newAnswer;
    });
  }, [setAnswer]);

  const list = questions.map((question, questionIndex) => {
    const currentAnswer = answer?.answers && answer.answers[questionIndex];
    return (mode === "view"
            ? <ViewQuestionForm key={questionIndex}
                                taskIndex={taskIndex}
                                {...question}
                                answer={currentAnswer}
                                questionIndex={questionIndex}
                                exerciseIndex={exerciseIndex} />
            : <QuestionForm key={questionIndex}
                            taskIndex={taskIndex}
                            {...question}
                            answer={currentAnswer}
                            updateAnswer={updateAnswer(questionIndex)}
                            questionIndex={questionIndex}
                            exerciseIndex={exerciseIndex} />)
  });
  
  const cardTitle = t(`pages.lesson.form.tasks.exercises.types.${__t}.title`);

  return (
    <>
      <Row>
        <Col xs={24}
             hidden={mode === "view"}>
          <Typography.Title level={4}>{cardTitle}</Typography.Title>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        { list.map((questionForm, questionIndex) => (
            <Col xs={24}
                 key={questionIndex}>
              {questionForm}
            </Col>
          ))
        }
      </Row>
    </>
  )
}