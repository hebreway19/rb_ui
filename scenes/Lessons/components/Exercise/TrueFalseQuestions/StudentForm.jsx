import React, { useCallback } from "react";
import { Badge, Col, Row, Space, Typography } from "antd";
import { useTranslation } from "next-i18next";
import { ExerciseType } from "../../../../../constants/ExerciseType";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../../../../../shared/hooks";
import { UserRole } from "../../../../../constants";
import { HebForm, HebRadio } from "../../../../../components/HebElements";

export const QuestionForm = ({
                               _id,
                               question,
                               isTrue,
                               questionIndex,
                               updateAnswer,
                               mode
                             }) => {
  const {t} = useTranslation();

  const rootPathOfTranslate = "pages.lesson.form.tasks.exercises";

  const isItTrueLabel = t(`${rootPathOfTranslate}.isTrue.label`);
  const options = [
    {label: t("tooltips.yes"), value: true},
    {label: t("tooltips.no"), value: false},
  ];
  return (
    <Row gutter={[8, 8]}>
      <Col xs={mode === "preview" ? 8 : 7}>
        <HebForm.Item label={<h3>{isItTrueLabel}</h3>}
                    onChange={(event) => updateAnswer(event.target.value === 'true')}
                    initialValue={isTrue}
                    labelCol={{span: 24}}>
          <HebRadio.Group options={options}
                       value={isTrue}
                       optionType="button"
                       buttonStyle="solid" />
        </HebForm.Item>
      </Col>
      <Col xs={mode === "preview" ? 14 : 15}>
        <Typography.Paragraph dir="rlt" 
                              lang="he" 
                              style={{textAlign: "right"}}>
          {question?.he_nikkudot || question?.he || ""}
        </Typography.Paragraph>
      </Col>
      <Col xs={2}
           style={{textAlign: "right"}}>
        <Typography.Text lang="he">
          {`(${questionIndex + 1}`}
        </Typography.Text>
      </Col>
    </Row>
  );
};

export const ViewQuestionForm = ({
                                   _id,
                                   __t = ExerciseType.TrueFalseQuestions,
                                   question,
                                   userRole,
                                   isTrue,
                                   taskIndex,
                                   questionIndex,
                                   exerciseIndex,
                                   answer,
                                   correctAnswer,
                                   ...props
}) => {
  const {t} = useTranslation();
  const isIstTrueStudentAnswerLabel = userRole === UserRole.STUDENT
                                      ? t("pages.answer.student_answers.my_answer")
                                      : t("pages.answer.student_answers.single");
  const correctAnswerLabel = t("pages.answer.correct.label");
  const wrongAnswerLabel = t("pages.answer.incorrect.label");
  return (
    <Row>
      <Col xs={24}>
        <Badge.Ribbon text={correctAnswer === isTrue 
                            ? <>
                                <Space>
                                  <CheckCircleOutlined />
                                  {correctAnswerLabel}
                                </Space>
                              </> 
                            : <>
                                <Space>
                                  <CloseCircleOutlined />
                                  {wrongAnswerLabel}
                                </Space>
                              </>}
                      placement="start"
                      color={correctAnswer === isTrue ? "#1e9c73" : "#de9b16"}>
          <Row gutter={[8, 8]}
                style={{paddingTop: 34, paddingLeft: 4}}>
            <Col xs={0} md={4}>
              <Typography.Text>{`${isIstTrueStudentAnswerLabel}: `}</Typography.Text>
              <Typography.Text strong>
                {isTrue ? t("pages.answer.correct.boolean") : t("pages.answer.incorrect.boolean")}
              </Typography.Text>
            </Col>
            <Col xs={20} md={18}>
              <Typography.Paragraph dir="rtl" 
                                    lang="he" 
                                    style={{
                                      textAlign: "right",
                                      padding: 0,
                                      margin: 0
                                    }}>
                {question?.he_nikkudot || question?.he || ""}
              </Typography.Paragraph>
            </Col>
            <Col xs={4} md={2}
                 style={{textAlign: "right"}}>
              <Typography.Text lang="he">
                {`(${questionIndex + 1}`}
              </Typography.Text>
            </Col>
            <Col xs={20} md={0}>
              <Typography.Text>{`${isIstTrueStudentAnswerLabel}: `}</Typography.Text>
              <Typography.Text strong>
                {isTrue ? t("pages.answer.correct.boolean") : t("pages.answer.incorrect.boolean")}
              </Typography.Text>
            </Col>
          </Row>
        </Badge.Ribbon>
      </Col>
    </Row>
  );
}

export const StudentForm = ({
                              _id,
                              __t = ExerciseType.TrueFalseQuestions,
                              taskIndex,
                              exerciseIndex,
                              questions = [],
                              answer = {answers: []},
                              commitAnswer,
                              mode,
                              ...props
                            }) => {
  const {t} = useTranslation();
  const {user} = useAuth();
  
  const updateAnswer = useCallback((questionIndex) => async (isTrue) => {
    const newAnswers = (answer?.answers || []);
    newAnswers[questionIndex] = isTrue;
    await commitAnswer(_id, {
        ...answer,
        __t: "TrueFalseQuestionsAnswer",
        answers: newAnswers
    });
  }, [commitAnswer, answer, _id]);

  const list = questions.map((question, questionIndex) => {
      const isTrue = answer?.answers && answer.answers[questionIndex];
      return (mode === "view"
              ? <ViewQuestionForm key={questionIndex}
                                  taskIndex={taskIndex} 
                                  {...question}
                                  isTrue={isTrue}
                                  userRole={user?.role}
                                  correctAnswer={question?.isTrue}
                                  questionIndex={questionIndex}
                                  exerciseIndex={exerciseIndex} />
              : <QuestionForm key={questionIndex}
                              taskIndex={taskIndex}
                              {...question}
                              isTrue={isTrue}
                              mode={mode}
                              updateAnswer={updateAnswer(questionIndex)}
                              questionIndex={questionIndex}
                              exerciseIndex={exerciseIndex} />);
  });
  
  const cardTitle = t(`pages.lesson.form.tasks.exercises.types.${__t}.title`);

  return (
    <>
      <Row>
        <Col xs={24} hidden={mode === "view"}>
          <Typography.Title level={4}>{cardTitle}</Typography.Title>
        </Col>
      </Row>
      <Row gutter={16}>
          <Col xs={24}>
              <Row gutter={[8, 8]}>
                  {list.map((questionForm, questionIndex) => (
                      <Col xs={24}
                           key={questionIndex}>
                          {questionForm}
                      </Col>
                    ))
                  }
              </Row>
          </Col>
      </Row>
    </>
  );
}

 StudentForm;